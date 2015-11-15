# Customer Rep Level

Permission : request.session['currentUser']['type'] = 1

### Record a sale
Route: POST /items/sold

### Add/edit/Delete customer
```
Route:  POST /customers/add
        GET /customers <- ALL CUSTOMERS
        GET /customers/{id} <- 1 Customer
        PUT /customers/{id}
      DELETE /customers/{id}
```

# Customer Level

### Bid History for auction
Route: GET /auctions/{id}/bids

### Items sold by seller and auction info
Route: GET /customers/{id}/sellHistory

### Items available by type or by keyword
Route: GET /items/search?type=''

Route: GET /items/search?keyword=''

```python
getVars = request.GET
getVars['type']
```

### Receipts
```
Route: GET /generate/receipt?auctionID=''
request.session['currentUser']['type'] = 1
OR
request.session['currentUser']['ID'] = auction.buyerID || auction.sellerID
```
