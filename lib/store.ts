import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Stock, Message, Alert } from './mock-data'
import { messagesData, alertsData } from './mock-data'
import { NewsFilters } from './api/types'

interface AppState {
  // Watchlist
  watchlist: string[]
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  
  // Selected stocks for comparison
  selectedStocks: string[]
  setSelectedStocks: (symbols: string[]) => void
  
  // Chat
  messages: typeof messagesData
  currentChannel: string
  setCurrentChannel: (channelId: string) => void
  addMessage: (channelId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  
  // Alerts
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'triggeredAt' | 'status'>) => void
  removeAlert: (id: string) => void
  
  // News
  newsFilters: NewsFilters
  setNewsFilters: (filters: NewsFilters) => void
  newsViewMode: 'grid' | 'list'
  setNewsViewMode: (mode: 'grid' | 'list') => void
  bookmarkedNews: string[] // URLs of bookmarked articles
  addBookmark: (url: string) => void
  removeBookmark: (url: string) => void
  
  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  selectedStock: string | null
  setSelectedStock: (symbol: string | null) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Watchlist
      watchlist: [],
      addToWatchlist: (symbol) =>
        set((state) => ({
          watchlist: state.watchlist.includes(symbol)
            ? state.watchlist
            : [...state.watchlist, symbol],
        })),
      removeFromWatchlist: (symbol) =>
        set((state) => ({
          watchlist: state.watchlist.filter((s) => s !== symbol),
        })),
      
      // Selected stocks
      selectedStocks: [],
      setSelectedStocks: (symbols) => set({ selectedStocks: symbols }),
      
      // Chat
      messages: messagesData,
      currentChannel: 'market-talk',
      setCurrentChannel: (channelId) => set({ currentChannel: channelId }),
      addMessage: (channelId, message) =>
        set((state) => {
          const channel = state.messages.channels.find((c) => c.id === channelId)
          if (!channel) return state
          
          const newMessage: Message = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
          }
          
          return {
            messages: {
              ...state.messages,
              channels: state.messages.channels.map((c) =>
                c.id === channelId
                  ? { ...c, messages: [...c.messages, newMessage] }
                  : c
              ),
            },
          }
        }),
      
      // Alerts
      alerts: alertsData,
      addAlert: (alert) =>
        set((state) => {
          const newAlert: Alert = {
            ...alert,
            id: Date.now().toString(),
            status: 'active',
            createdAt: new Date().toISOString(),
            triggeredAt: null,
          }
          return { alerts: [...state.alerts, newAlert] }
        }),
      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== id),
        })),
      
      // News
      newsFilters: {
        limit: 12,
        skip: 0,
      },
      setNewsFilters: (filters) => set({ newsFilters: filters }),
      newsViewMode: 'grid',
      setNewsViewMode: (mode) => set({ newsViewMode: mode }),
      bookmarkedNews: [],
      addBookmark: (url) =>
        set((state) => ({
          bookmarkedNews: state.bookmarkedNews.includes(url)
            ? state.bookmarkedNews
            : [...state.bookmarkedNews, url],
        })),
      removeBookmark: (url) =>
        set((state) => ({
          bookmarkedNews: state.bookmarkedNews.filter((u) => u !== url),
        })),
      
      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      selectedStock: null,
      setSelectedStock: (symbol) => set({ selectedStock: symbol }),
    }),
    {
      name: 'stocet-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
        alerts: state.alerts,
        newsFilters: state.newsFilters,
        newsViewMode: state.newsViewMode,
        bookmarkedNews: state.bookmarkedNews,
      }),
    }
  )
)
