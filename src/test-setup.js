import { vi } from 'vitest'

// Mock do Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: [{ id: 1 }], error: null }))
      }))
    }))
  }))
}))

// Mock das variáveis de ambiente
Object.defineProperty(window, 'import.meta', {
  value: {
    env: {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-key'
    }
  }
})

// Mock do fetch para as Netlify Functions
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
)

// Limpar mocks após cada teste
afterEach(() => {
  vi.clearAllMocks()
})