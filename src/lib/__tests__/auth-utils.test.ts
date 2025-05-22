import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '../auth-utils'

describe('認証ユーティリティ関数のテスト', () => {
  describe('hashPassword', () => {
    it('パスワードをハッシュ化して文字列を返すこと', async () => {
      const password = 'testPassword123'
      const hashedPassword = await hashPassword(password)
      
      // ハッシュ化されたパスワードは元のパスワードと異なるはず
      expect(hashedPassword).not.toBe(password)
      // ハッシュ化されたパスワードは文字列であること
      expect(typeof hashedPassword).toBe('string')
      // bcryptのハッシュは通常60文字程度になる
      expect(hashedPassword.length).toBeGreaterThan(50)
    })

    it('同じパスワードでも異なるハッシュ値を生成すること（ソルトが異なるため）', async () => {
      const password = 'samePassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      
      // 同じパスワードからでも異なるハッシュが生成されるはず（ソルトが毎回異なるため）
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('comparePassword', () => {
    it('正しいパスワードを比較すると true を返すこと', async () => {
      const password = 'correctPassword123'
      const hashedPassword = await hashPassword(password)
      
      const result = await comparePassword(password, hashedPassword)
      expect(result).toBe(true)
    })

    it('間違ったパスワードを比較すると false を返すこと', async () => {
      const password = 'correctPassword123'
      const wrongPassword = 'wrongPassword456'
      const hashedPassword = await hashPassword(password)
      
      const result = await comparePassword(wrongPassword, hashedPassword)
      expect(result).toBe(false)
    })

    it('空のパスワードを比較すると false を返すこと', async () => {
      const password = 'somePassword123'
      const emptyPassword = ''
      const hashedPassword = await hashPassword(password)
      
      const result = await comparePassword(emptyPassword, hashedPassword)
      expect(result).toBe(false)
    })
  })
})
