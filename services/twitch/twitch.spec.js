'use strict'

const { expect } = require('chai')
const nock = require('nock')
const { cleanUpNockAfterEach, defaultContext } = require('../test-helpers')
const TwitchStatus = require('./twitch.service')

describe('TwitchStatus', function () {
  describe('auth', function () {
    cleanUpNockAfterEach()

    const user = 'admin'
    const pass = 'password'
    const token = 'my-token'
    const config = {
      private: {
        twitch_client_id: user,
        twitch_client_secret: pass,
      },
    }

    it('sends the auth information as configured', async function () {
      const tokenNock = nock('https://id.twitch.tv')
        .post('/oauth2/token')
        // This ensures that the expected credentials are actually being sent with the HTTP request.
        // Without this the request wouldn't match and the test would fail.
        .query({
          grant_type: 'client_credentials',
          client_id: user,
          client_secret: pass,
        })
        .reply(200, {
          access_token: token,
          expires_in: 2000000,
        })

      const statusNock = nock('https://api.twitch.tv')
        .get('/helix/streams')
        .reply(200, {
          data: [],
        })

      expect(
        await TwitchStatus.invoke(defaultContext, config, {
          status: 'andyonthewings',
        })
      ).to.deep.equal({
        message: 'offline',
        link: 'https://www.twitch.tv/undefined',
        color: 'lightgrey',
      })

      tokenNock.done()
      statusNock.done()
    })
  })
})
