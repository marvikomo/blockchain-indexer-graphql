# SeaPort Sales Event Listener

A basic implementation for listening to Sales Events on the OpenSea SeaPort Smart Contract


## Getting Started
------------------
1. Clone the repo and cd into the project diectory `cd blockchain-indexer-grapql`

2. Install necessary dependencies `npm install`

3. Create `.env` file with necessary environment variables.

4. Run the server using `npm run dev`


## Table Creation SQL
--------------
```
CREATE TABLE seaport_sales(  
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_hash VARCHAR(255) NOT NULL,
    offerer VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    token_id INT NOT NULL,
    token_address VARCHAR NOT NULL,
    quantity INT,
    amount DECIMAL(10, 4),
    create_time TIMESTAMP DEFAULT NOW(),
    update_time TIMESTAMP DEFAULT NOW()
);
```
