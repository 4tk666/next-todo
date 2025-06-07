import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSessionUserIdOrError } from '../auth-helpers'

// 認証モジュールのモック
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

import { auth } from '@/auth'

// モック関数の型定義
const mockAuth = auth as ReturnType<typeof vi.fn>

describe('認証関連ヘルパー関数のテスト', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks()
  })

  describe('getSessionUserIdOrError', () => {
    it('有効なセッションがある場合は成功レスポンスを返すこと', async () => {
      const mockUserId = 'test-user-id'
      const mockSession = {
        user: {
          id: mockUserId,
          email: 'test@example.com',
          name: 'テストユーザー',
        },
        expires: '2025-12-31T23:59:59.999Z',
      }

      // 認証関数が有効なセッションを返すように設定
      mockAuth.mockResolvedValue(mockSession)

      const result = await getSessionUserIdOrError()

      expect(result).toEqual({
        success: true,
        userId: mockUserId,
      })
      expect(mockAuth).toHaveBeenCalledOnce()
    })

    it('セッションがnullの場合はエラーレスポンスを返すこと', async () => {
      // 認証関数がnullを返すように設定
      mockAuth.mockResolvedValue(null)

      const result = await getSessionUserIdOrError()

      expect(result).toEqual({
        success: false,
        errorMessage: 'ログインが必要です',
      })
      expect(mockAuth).toHaveBeenCalledOnce()
    })

    it('セッションがundefinedの場合はエラーレスポンスを返すこと', async () => {
      // 認証関数がundefinedを返すように設定
      mockAuth.mockResolvedValue(undefined)

      const result = await getSessionUserIdOrError()

      expect(result).toEqual({
        success: false,
        errorMessage: 'ログインが必要です',
      })
      expect(mockAuth).toHaveBeenCalledOnce()
    })

    it('セッションはあるがuserがnullの場合はエラーレスポンスを返すこと', async () => {
      const mockSession = {
        user: null,
        expires: '2025-12-31T23:59:59.999Z',
      }

      // 認証関数がuserがnullのセッションを返すように設定
      mockAuth.mockResolvedValue(mockSession)

      const result = await getSessionUserIdOrError()

      expect(result).toEqual({
        success: false,
        errorMessage: 'ログインが必要です',
      })
      expect(mockAuth).toHaveBeenCalledOnce()
    })

    it('セッションはあるがuserがundefinedの場合はエラーレスポンスを返すこと', async () => {
      const mockSession = {
        user: undefined,
        expires: '2025-12-31T23:59:59.999Z',
      }

      // 認証関数がuserがundefinedのセッションを返すように設定
      mockAuth.mockResolvedValue(mockSession)

      const result = await getSessionUserIdOrError()

      expect(result).toEqual({
        success: false,
        errorMessage: 'ログインが必要です',
      })
      expect(mockAuth).toHaveBeenCalledOnce()
    })

    it('userはあるがidがnullの場合はエラーレスポンスを返すこと', async () => {
      const mockSession = {
        user: {
          id: null,
          email: 'test@example.com',
          name: 'テストユーザー',
        },
        expires: '2025-12-31T23:59:59.999Z',
      }

      // 認証関数がidがnullのuserを持つセッションを返すように設定
      mockAuth.mockResolvedValue(mockSession)

      const result = await getSessionUserIdOrError()

      expect(result).toEqual({
        success: false,
        errorMessage: 'ログインが必要です',
      })
      expect(mockAuth).toHaveBeenCalledOnce()
    })

    it('userはあるがidがundefinedの場合はエラーレスポンスを返すこと', async () => {
      const mockSession = {
        user: {
          id: undefined,
          email: 'test@example.com',
          name: 'テストユーザー',
        },
        expires: '2025-12-31T23:59:59.999Z',
      }

      // 認証関数がidがundefinedのuserを持つセッションを返すように設定
      mockAuth.mockResolvedValue(mockSession)

      const result = await getSessionUserIdOrError()

      expect(result).toEqual({
        success: false,
        errorMessage: 'ログインが必要です',
      })
      expect(mockAuth).toHaveBeenCalledOnce()
    })

    it('userはあるがidが空文字列の場合はエラーレスポンスを返すこと', async () => {
      const mockSession = {
        user: {
          id: '',
          email: 'test@example.com',
          name: 'テストユーザー',
        },
        expires: '2025-12-31T23:59:59.999Z',
      }

      // 認証関数がidが空文字列のuserを持つセッションを返すように設定
      mockAuth.mockResolvedValue(mockSession)

      const result = await getSessionUserIdOrError()

      expect(result).toEqual({
        success: false,
        errorMessage: 'ログインが必要です',
      })
      expect(mockAuth).toHaveBeenCalledOnce()
    })

    it('認証関数でエラーが発生した場合は例外が投げられること', async () => {
      const authError = new Error('認証システムエラー')

      // 認証関数がエラーを投げるように設定
      mockAuth.mockRejectedValue(authError)

      // エラーが投げられることを確認
      await expect(getSessionUserIdOrError()).rejects.toThrow('認証システムエラー')
      expect(mockAuth).toHaveBeenCalledOnce()
    })

    it('セッションに追加のプロパティがあっても正常に処理されること', async () => {
      const mockUserId = 'test-user-id'
      const mockSession = {
        user: {
          id: mockUserId,
          email: 'test@example.com',
          name: 'テストユーザー',
          image: 'https://example.com/avatar.jpg',
          role: 'user',
        },
        expires: '2025-12-31T23:59:59.999Z',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await getSessionUserIdOrError()

      expect(result).toEqual({
        success: true,
        userId: mockUserId,
      })
      expect(mockAuth).toHaveBeenCalledOnce()
    })
  })
})
