import axios from 'axios'
import errors from 'common-errors'

import l from 'helpers/logger'

const CRYPTOCOMPARE_API = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=UBQ&tsyms=BTC,USD,EUR,ETH,LTC'

class TickerService {
  async symbols() {
    l.info('TickerService - symbols() / Returning list of supported tickers')
    return {
      symbols: [
        'ubqusd',
        'ubqeur',
        'ubqbtc',
        'ubqeth',
        'ubqltc'
      ]
    }
  }

  async symbol(symbol) {
    l.info(`TickerService - symbols() / Fetching request for current symbol: ${symbol}`)
    try {
      const res = await axios(CRYPTOCOMPARE_API)
      return this.toTickerJson(symbol, res)
    } catch (err) {
      l.error(`TickerService - symbols() / Error fetching request for current symbol: ${symbol} | ${err}`)
      throw errors.Http502Error({
        message: "Can't retrieve ticker list from original server. Please, try again later."
      })
    }
  }

  toTickerJson(symbol, resp) {
    l.info('TickerService - symbols() / Converting information to ticker...')
    const currency = symbol.replace('ubq', '').toUpperCase()
    const json = JSON.parse(resp.data)
    return {
      base: json.RAW.UBQ[currency].FROMSYMBOL,
      quote: json.RAW.UBQ[currency].TOSYMBOL,
      price: json.RAW.UBQ[currency].PRICE,
      bid: json.RAW.UBQ[currency].BID,
      ask: json.RAW.UBQ[currency].ASK,
      last_update: json.RAW.UBQ[currency].LASTUPDATE,
      total_volume_24h: json.RAW.UBQ[currency].TOTALVOLUME24H,
      exchange: json.RAW.UBQ[currency].LASTMARKET
    }
  }
}

export default new TickerService()
