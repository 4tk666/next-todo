import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateTodoOwnership, validateParentId } from '../todo-helpers'

// Prismaクライアントのモック
vi.mock('@/lib/prisma', () => ({
  prisma: {
    todo: {
      findFirst: vi.fn(),
    },
  },
}))

// 認証ヘルパーのモック
vi.mock('../auth-helpers', () => ({
  getSessionUserIdOrError: vi.fn(),
}))

import { prisma } from '@/lib/prisma'
import { getSessionUserIdOrError } from '../auth-helpers'

// モック関数の型定義
const mockPrisma = prisma as unknown as {
  todo: {
    findFirst: ReturnType<typeof vi.fn>
  }
}
const mockGetSessionUserIdOrError = getSessionUserIdOrError as ReturnType<typeof vi.fn>

describe('Todo関連ヘルパー関数のテスト', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks()
  })

  describe('validateTodoOwnership', () => {
    const mockTodoId = 'test-todo-id'
    const mockUserId = 'test-user-id'

    it('認証エラーの場合は認証エラーメッセージを返すこと', async () => {
      // 認証ヘルパーが失敗を返すように設定
      mockGetSessionUserIdOrError.mockResolvedValue({
        success: false,
        errorMessage: 'ログインが必要です',
      })

      const result = await validateTodoOwnership(mockTodoId)

      expect(result).toEqual({
        success: false,
        errorMessage: 'ログインが必要です',
      })
      expect(mockGetSessionUserIdOrError).toHaveBeenCalledOnce()
      // Prismaのクエリは実行されないはず
      expect(mockPrisma.todo.findFirst).not.toHaveBeenCalled()
    })

    it('Todoが存在しない場合はエラーメッセージを返すこと', async () => {
      // 認証ヘルパーが成功を返すように設定
      mockGetSessionUserIdOrError.mockResolvedValue({
        success: true,
        userId: mockUserId,
      })

      // Prismaがnullを返すように設定（Todoが見つからない）
      mockPrisma.todo.findFirst.mockResolvedValue(null)

      const result = await validateTodoOwnership(mockTodoId)

      expect(result).toEqual({
        success: false,
        errorMessage: 'タスクが見つかりません',
      })
      expect(mockPrisma.todo.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockTodoId,
          userId: mockUserId,
        },
      })
    })

    it('Todoが存在し、所有者が一致する場合は成功を返すこと', async () => {
      const mockTodo = {
        id: mockTodoId,
        userId: mockUserId,
        title: 'テストタスク',
        description: 'テスト用の説明',
        priority: 'MEDIUM',
        status: 'PENDING',
        isCompleted: false,
        dueDate: null,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // 認証ヘルパーが成功を返すように設定
      mockGetSessionUserIdOrError.mockResolvedValue({
        success: true,
        userId: mockUserId,
      })

      // PrismaがTodoを返すように設定
      mockPrisma.todo.findFirst.mockResolvedValue(mockTodo)

      const result = await validateTodoOwnership(mockTodoId)

      expect(result).toEqual({ success: true })
      expect(mockPrisma.todo.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockTodoId,
          userId: mockUserId,
        },
      })
    })

    it('異なるユーザーのTodoにアクセスしようとした場合はエラーを返すこと', async () => {
      const otherUserId = 'other-user-id'

      // 認証ヘルパーが成功を返すように設定
      mockGetSessionUserIdOrError.mockResolvedValue({
        success: true,
        userId: mockUserId,
      })

      // Prismaがnullを返すように設定（異なるユーザーのTodoなので見つからない）
      mockPrisma.todo.findFirst.mockResolvedValue(null)

      const result = await validateTodoOwnership(mockTodoId)

      expect(result).toEqual({
        success: false,
        errorMessage: 'タスクが見つかりません',
      })
      expect(mockPrisma.todo.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockTodoId,
          userId: mockUserId, // 認証されたユーザーのIDでクエリされる
        },
      })
    })

    it('空文字列のTodoIDが渡された場合でも適切に処理されること', async () => {
      const emptyTodoId = ''

      // 認証ヘルパーが成功を返すように設定
      mockGetSessionUserIdOrError.mockResolvedValue({
        success: true,
        userId: mockUserId,
      })

      // Prismaがnullを返すように設定
      mockPrisma.todo.findFirst.mockResolvedValue(null)

      const result = await validateTodoOwnership(emptyTodoId)

      expect(result).toEqual({
        success: false,
        errorMessage: 'タスクが見つかりません',
      })
      expect(mockPrisma.todo.findFirst).toHaveBeenCalledWith({
        where: {
          id: emptyTodoId,
          userId: mockUserId,
        },
      })
    })

    it('Prismaエラーが発生した場合は例外が投げられること', async () => {
      // 認証ヘルパーが成功を返すように設定
      mockGetSessionUserIdOrError.mockResolvedValue({
        success: true,
        userId: mockUserId,
      })

      // Prismaがエラーを投げるように設定
      const dbError = new Error('データベース接続エラー')
      mockPrisma.todo.findFirst.mockRejectedValue(dbError)

      // エラーが投げられることを確認
      await expect(validateTodoOwnership(mockTodoId)).rejects.toThrow('データベース接続エラー')
    })
  })

  describe('validateParentId', () => {
    const mockUserId = 'test-user-id'
    const mockParentId = 'test-parent-id'

    it('parentIdがnullの場合は成功を返すこと', async () => {
      const result = await validateParentId(null)

      expect(result).toEqual({ success: true })
      // 認証チェックやPrismaクエリは実行されないはず
      expect(mockGetSessionUserIdOrError).not.toHaveBeenCalled()
      expect(mockPrisma.todo.findFirst).not.toHaveBeenCalled()
    })

    it('parentIdが空文字列の場合は成功を返すこと', async () => {
      const result = await validateParentId('')

      expect(result).toEqual({ success: true })
      // 認証チェックやPrismaクエリは実行されないはず
      expect(mockGetSessionUserIdOrError).not.toHaveBeenCalled()
      expect(mockPrisma.todo.findFirst).not.toHaveBeenCalled()
    })

    it('parentIdが"unselected"の場合は成功を返すこと', async () => {
      const result = await validateParentId('unselected')

      expect(result).toEqual({ success: true })
      // 認証チェックやPrismaクエリは実行されないはず
      expect(mockGetSessionUserIdOrError).not.toHaveBeenCalled()
      expect(mockPrisma.todo.findFirst).not.toHaveBeenCalled()
    })


    it('親Todoが存在しない場合はエラーメッセージを返すこと', async () => {
      // 認証ヘルパーが成功を返すように設定
      mockGetSessionUserIdOrError.mockResolvedValue({
        success: true,
        userId: mockUserId,
      })

      // Prismaがnullを返すように設定（親Todoが見つからない）
      mockPrisma.todo.findFirst.mockResolvedValue(null)

      const result = await validateParentId(mockParentId)

      expect(result).toEqual({
        success: false,
        errorMessage: '選択された親タスクは存在しないか、アクセス権限がありません。',
      })
      expect(mockPrisma.todo.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockParentId,
          userId: mockUserId,
        },
        select: {
          id: true,
        },
      })
    })

    it('親Todoが存在し、所有者が一致する場合は成功を返すこと', async () => {
      const mockParentTodo = {
        id: mockParentId,
      }

      // 認証ヘルパーが成功を返すように設定
      mockGetSessionUserIdOrError.mockResolvedValue({
        success: true,
        userId: mockUserId,
      })

      // Prismaが親Todoを返すように設定
      mockPrisma.todo.findFirst.mockResolvedValue(mockParentTodo)

      const result = await validateParentId(mockParentId)

      expect(result).toEqual({ success: true })
      expect(mockPrisma.todo.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockParentId,
          userId: mockUserId,
        },
        select: {
          id: true,
        },
      })
    })

    it('異なるユーザーの親Todoにアクセスしようとした場合はエラーを返すこと', async () => {
      // 認証ヘルパーが成功を返すように設定
      mockGetSessionUserIdOrError.mockResolvedValue({
        success: true,
        userId: mockUserId,
      })

      // Prismaがnullを返すように設定（異なるユーザーの親Todoなので見つからない）
      mockPrisma.todo.findFirst.mockResolvedValue(null)

      const result = await validateParentId(mockParentId)

      expect(result).toEqual({
        success: false,
        errorMessage: '選択された親タスクは存在しないか、アクセス権限がありません。',
      })
      expect(mockPrisma.todo.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockParentId,
          userId: mockUserId, // 認証されたユーザーのIDでクエリされる
        },
        select: {
          id: true,
        },
      })
    })
  })
})
