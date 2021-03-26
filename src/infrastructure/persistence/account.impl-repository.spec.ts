import { describe, test } from '@jest/globals'
import request from 'supertest'

const mKnex = { select: jest.fn() };
const myMock = jest.fn(() => mKnex);

describe('Errors Handler Middleware', () => {
  it('should select a user', async () => {
    const userId: string = 'e04dd8e9-a0ca-42d2-bd51-053caee7f4cd';
  })
})