import { sign, verify } from 'jsonwebtoken'
import { IDecrypter } from '~/application/ports/decrypter'
import { IEncrypter } from '~/application/ports/encrypter'

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: any,
  ) {}

  async encrypt(id: string): Promise<string> {
    return sign({ id }, this.secret, { expiresIn: this.expiresIn || 3600 })
  }

  async decrypt(jwt: string): Promise<any> {
    return verify(jwt, this.secret) as any
  }
}
