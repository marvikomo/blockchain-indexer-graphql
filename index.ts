import express, { Application } from 'express'
import { ethers } from 'ethers'
import { Pool, Client } from 'pg'
import abi from './seaport.abi.json'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()
console.log(process.env.API_KEY)
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
  })

app.get('/', (req, res) => {
  res.status(200).json('starting...')
})

async function start(): Promise<void> {
  const PORT: any = process.env.PORT
  await main();
   // app.listen(PORT, () => {
    //   console.log(`Server is listening on port ${PORT}.`)
    // });
}

export async function main(): Promise<void> { 
    const seaPortAddress: string = '0x00000000006c3852cbEf3e08E8dF289169EdE581'
    const provider = new ethers.providers.WebSocketProvider(
      `wss://eth-mainnet.g.alchemy.com/v2/${process.env.API_KEY}`,
    )
    const contract: any = await new ethers.Contract(seaPortAddress, abi, provider)
    contract.on(
      'OrderFulfilled',
      (orderHash, offerer, zone, fulfiller, spentItems, receivedItems) => {
        let totalAmountSpent = 0
        let numberOfTokensOffered = spentItems.length
        const offer = spentItems.map((ele, idx) => {
          return {
            itemType: ele.itemType,
            token_addr: ele.token,
            token_id: ethers.utils.formatUnits(ele.identifier, 0),
            amount: ethers.utils.formatUnits(ele.amount, 0),
          }
        })
  
        receivedItems.forEach((ele: any) => {
          totalAmountSpent += Number(ethers.utils.formatUnits(ele.amount, 18))
        })
  
        offer.forEach((item: any) => {
          if (item.itemType !== 2) return
          let quer = `INSERT INTO seaport_sales(order_hash, offerer, recipient, token_id, token_address, quantity, amount) 
        VALUES('${orderHash}', '${offerer}', '${fulfiller}', ${item.token_id}, '${
            item.token_addr
          }', ${item.amount}, ${totalAmountSpent / numberOfTokensOffered})`
          client.query(quer, (err, res) => {
            console.log(err, res)
          })
  
          console.log(quer)
        })
      },
    )
  }

start()
process.on('SIGINT', function () {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)')
  process.exit(1)
})
