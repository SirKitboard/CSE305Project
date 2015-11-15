Permission : Manager only

### Add/Modify/Delete Employee

```
Route:  POST /employees
        PUT /employees/{id}
        DELETE /employees/{id}
        GET /employees
        GET /employees/{id}
```

### Sales Report
Route: GET /generate/salesReport?month=''&year=''&itemID=''&customerID=''&itemType=''

### Max Revenue
Route: GET /generate/revenueReport?rep=''&customerID=''


Permission : Anyone

### Best Sellers
Route: GET /generate/bestSellers

### Suggestions List
Route: GET /items/suggestions

### Produce Mailing List
Route: GET /generate/mailingList

### Auction History for customer (Current and past auctions)
Route: GET /customers/{id}/auctions
