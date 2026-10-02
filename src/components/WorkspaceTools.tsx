import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initWorkspaceAuth,
  googleSignIn,
  workspaceLogout,
  getCachedAccessToken,
  createClinicSpreadsheet,
  fetchSpreadsheetRows,
  appendAppointmentToSheet,
  listChatSpaces,
  sendChatMessage,
  listChatMessages
} from '../lib/googleWorkspace';
import { AppointmentDetails } from '../types';
import {
  FileSpreadsheet,
  MessageSquare,
  LogOut,
  Plus,
  RefreshCw,
  Send,
  AlertCircle,
  CheckCircle2,
  Table,
  Search,
  ExternalLink,
  ShieldAlert,
  Calendar
} from 'lucide-react';

interface WorkspaceToolsProps {
  localAppointments: AppointmentDetails[];
}

export const WorkspaceTools: React.FC<WorkspaceToolsProps> = ({ localAppointments }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'sheets' | 'chat'>('sheets');

  // Sheets state
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => {
    return localStorage.getItem('dr_ayesha_sheet_id') || '';
  });
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [sheetSearch, setSheetSearch] = useState<string>('');
  const [loadingSheet, setLoadingSheet] = useState<boolean>(false);
  const [sheetStatus, setSheetStatus] = useState<string | null>(null);

  // Chat state
  const [spaces, setSpaces] = useState<any[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [chatStatus, setChatStatus] = useState<string | null>(null);

  // Confirmation Modals (Mandatory for mutating/destructive operations as required by guidelines)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'sync_sheet' | 'send_chat';
    title: string;
    description: string;
    actionLabel: string;
    payload?: any;
  }>({
    isOpen: false,
    type: 'sync_sheet',
    title: '',
    description: '',
    actionLabel: 'Confirm'
  });

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (u, token) => {
        setUser(u);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (spreadsheetId) {
      localStorage.setItem('dr_ayesha_sheet_id', spreadsheetId);
    }
  }, [spreadsheetId]);

  // Load Sheet Rows when spreadsheetId or tab changes
  useEffect(() => {
    if (accessToken && spreadsheetId && activeSubTab === 'sheets') {
      loadSheetData();
    }
  }, [accessToken, spreadsheetId, activeSubTab]);

  // Load Chat Spaces when tab changes
  useEffect(() => {
    if (accessToken && activeSubTab === 'chat') {
      loadChatSpaces();
    }
  }, [accessToken, activeSubTab]);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setSheetStatus(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      setSheetStatus(`Authentication failed: ${err.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await workspaceLogout();
    setUser(null);
    setAccessToken(null);
    setNeedsAuth(true);
  };

  // Google Sheets Actions
  const handleCreateNewSheet = async () => {
    const token = accessToken || getCachedAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setLoadingSheet(true);
    setSheetStatus(null);
    try {
      const newId = await createClinicSpreadsheet(token, "Dr. Ayesha Awan Clinic Appointments & Log");
      setSpreadsheetId(newId);
      setSheetStatus("✅ Successfully created new Google Sheet in Drive!");
      await loadSheetData(newId);
    } catch (err: any) {
      setSheetStatus(`Error creating Google Sheet: ${err.message}`);
    } finally {
      setLoadingSheet(false);
    }
  };

  const loadSheetData = async (targetId?: string) => {
    const idToUse = targetId || spreadsheetId;
    const token = accessToken || getCachedAccessToken();
    if (!token || !idToUse) return;

    setLoadingSheet(true);
    setSheetStatus(null);
    try {
      const rows = await fetchSpreadsheetRows(token, idToUse);
      setSheetRows(rows);
    } catch (err: any) {
      setSheetStatus(`Error reading Google Sheet: ${err.message}`);
    } finally {
      setLoadingSheet(false);
    }
  };

  const requestSyncAppointmentsToSheet = () => {
    if (localAppointments.length === 0) {
      setSheetStatus("No local appointments available to sync.");
      return;
    }
    if (!spreadsheetId) {
      setSheetStatus("Please create or enter a Google Sheet ID first.");
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: 'sync_sheet',
      title: 'Sync Appointments to Google Sheets',
      description: `This operation will append ${localAppointments.length} appointment record(s) to your Google Sheet (ID: ${spreadsheetId}). Existing rows will be preserved.`,
      actionLabel: 'Confirm Sync to Google Sheet'
    });
  };

  const executeSyncAppointmentsToSheet = async () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
    const token = accessToken || getCachedAccessToken();
    if (!token || !spreadsheetId) return;

    setLoadingSheet(true);
    setSheetStatus(null);
    let syncedCount = 0;
    try {
      for (const app of localAppointments) {
        await appendAppointmentToSheet(token, spreadsheetId, app);
        syncedCount++;
      }
      setSheetStatus(`✅ Successfully synced ${syncedCount} appointment(s) to Google Sheet!`);
      await loadSheetData();
    } catch (err: any) {
      setSheetStatus(`Synced ${syncedCount} appointments before error: ${err.message}`);
    } finally {
      setLoadingSheet(false);
    }
  };

  // Google Chat Actions
  const loadChatSpaces = async () => {
    const token = accessToken || getCachedAccessToken();
    if (!token) return;

    setLoadingChat(true);
    setChatStatus(null);
    try {
      const spaceList = await listChatSpaces(token);
      setSpaces(spaceList);
      if (spaceList.length > 0 && !selectedSpace) {
        setSelectedSpace(spaceList[0].name);
        await loadMessagesForSpace(spaceList[0].name);
      }
    } catch (err: any) {
      setChatStatus(`Google Chat Error: ${err.message}`);
    } finally {
      setLoadingChat(false);
    }
  };

  const loadMessagesForSpace = async (spaceName: string) => {
    const token = accessToken || getCachedAccessToken();
    if (!token || !spaceName) return;

    setLoadingChat(true);
    try {
      const msgs = await listChatMessages(token, spaceName);
      setChatMessages(msgs);
    } catch (err: any) {
      setChatStatus(`Error fetching chat messages: ${err.message}`);
    } finally {
      setLoadingChat(false);
    }
  };

  const requestSendChatMessage = () => {
    if (!selectedSpace) {
      setChatStatus("Please select a Google Chat space first.");
      return;
    }
    if (!messageInput.trim()) {
      setChatStatus("Please enter a message to send.");
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: 'send_chat',
      title: 'Post Message to Google Chat Space',
      description: `You are about to post the following message to Google Chat space (${selectedSpace}):\n\n"${messageInput}"`,
      actionLabel: 'Post Message to Google Chat',
      payload: messageInput
    });
  };

  const executeSendChatMessage = async () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
    const textToSend = confirmModal.payload;
    const token = accessToken || getCachedAccessToken();
    if (!token || !selectedSpace || !textToSend) return;

    setLoadingChat(true);
    setChatStatus(null);
    try {
      await sendChatMessage(token, selectedSpace, textToSend);
      setMessageInput('');
      setChatStatus("✅ Message sent successfully to Google Chat!");
      await loadMessagesForSpace(selectedSpace);
    } catch (err: any) {
      setChatStatus(`Failed to send chat message: ${err.message}`);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Google Workspace Integration
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          Google Sheets & Google Chat Sync
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Connect your Google Workspace account to sync Dr. Ayesha Awan's patient appointments directly into Google Sheets and communicate with clinic staff via Google Chat.
        </p>
      </div>

      {/* Auth Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full border border-emerald-500" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                {user.displayName?.[0] || 'U'}
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>{user.displayName || 'Google User'}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-md">Connected</span>
              </p>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-900">Sign in with Google Workspace</h3>
            <p className="text-[11px] text-slate-500">
              Grant permissions to export patient logs to Google Sheets and post updates to Google Chat.
            </p>
          </div>
        )}

        {user ? (
          <button
            onClick={handleSignOut}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            disabled={isLoggingIn}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2.5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>{isLoggingIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveSubTab('sheets')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'sheets'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Google Sheets Sync</span>
        </button>

        <button
          onClick={() => setActiveSubTab('chat')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'chat'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>Google Chat Integration</span>
        </button>
      </div>

      {/* SHEETS TAB CONTENT */}
      {activeSubTab === 'sheets' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Table className="w-4 h-4 text-emerald-600" />
                  <span>Clinic Appointments Google Sheet</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Manage or create a dedicated Google Sheet in your Google Drive for patient appointments.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCreateNewSheet}
                  disabled={loadingSheet || !user}
                  className="w-full sm:w-auto py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Sheet in Drive</span>
                </button>

                {spreadsheetId && (
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    title="Open in Google Sheets"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Sheet ID Input Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  placeholder="Paste existing Google Sheet ID (e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs...)"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadSheetData()}
                  disabled={loadingSheet || !spreadsheetId || !user}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSheet ? 'animate-spin' : ''}`} />
                  <span>Load Sheet</span>
                </button>

                <button
                  onClick={requestSyncAppointmentsToSheet}
                  disabled={loadingSheet || !spreadsheetId || localAppointments.length === 0 || !user}
                  className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sync Local ({localAppointments.length})</span>
                </button>
              </div>
            </div>

            {sheetStatus && (
              <div className="p-3 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{sheetStatus}</span>
              </div>
            )}
          </div>

          {/* Sheet Rows Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-xs font-bold text-slate-800">
                Live Spreadsheet Preview {sheetRows.length > 0 && `(${sheetRows.length - 1} records)`}
              </h4>

              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={sheetSearch}
                  onChange={(e) => setSheetSearch(e.target.value)}
                  placeholder="Filter rows..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {sheetRows.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No Google Sheet loaded. Sign in and create or load a sheet above.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-80">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      {sheetRows[0]?.map((col, idx) => (
                        <th key={idx} className="p-2.5 whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sheetRows.slice(1)
                      .filter((row) => row.some((cell) => String(cell).toLowerCase().includes(sheetSearch.toLowerCase())))
                      .map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-50">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="p-2.5 whitespace-nowrap">{cell}</td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHAT TAB CONTENT */}
      {activeSubTab === 'chat' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Google Chat Spaces & Notifications</span>
              </h3>
              <p className="text-xs text-slate-500">
                Select a Google Chat Space to send appointment notifications, medical updates, or clinic updates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <select
                value={selectedSpace}
                onChange={(e) => {
                  setSelectedSpace(e.target.value);
                  loadMessagesForSpace(e.target.value);
                }}
                disabled={!user || spaces.length === 0}
                className="w-full sm:w-2/3 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                {spaces.length === 0 ? (
                  <option value="">No Google Chat Spaces found (or sign in required)</option>
                ) : (
                  spaces.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.displayName || s.name} ({s.spaceType || 'Space'})
                    </option>
                  ))
                )}
              </select>

              <button
                onClick={loadChatSpaces}
                disabled={loadingChat || !user}
                className="w-full sm:w-1/3 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingChat ? 'animate-spin' : ''}`} />
                <span>Refresh Spaces</span>
              </button>
            </div>

            {chatStatus && (
              <div className="p-3 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{chatStatus}</span>
              </div>
            )}
          </div>

          {/* Chat Post Box & Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Post message */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Post Message to Google Chat</h4>
                <textarea
                  rows={4}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="e.g., 📢 Clinic Update: Dr. Ayesha Awan will be available at Al Rehman Hospital starting 4:00 PM today. For appointments call 0322-5475456."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <button
                onClick={requestSendChatMessage}
                disabled={loadingChat || !selectedSpace || !messageInput.trim() || !user}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Message to Selected Space</span>
              </button>
            </div>

            {/* Chat Feed */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                Recent Messages in Space
              </h4>

              {chatMessages.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No messages loaded or space is empty.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {chatMessages.map((msg, index) => (
                    <div key={msg.name || index} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-700">{msg.sender?.displayName || 'User'}</span>
                        <span>{msg.createTime ? new Date(msg.createTime).toLocaleTimeString() : ''}</span>
                      </div>
                      <p className="text-slate-800 leading-snug">{msg.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY CONFIRMATION DIALOG FOR MUTATING/DESTRUCTIVE OPERATIONS */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{confirmModal.title}</h3>
                <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
                  {confirmModal.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.type === 'sync_sheet' ? executeSyncAppointmentsToSheet : executeSendChatMessage}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
