'use strict';

const express = require('express');
const sqlite3 = require('sqlite3');

const PORT = process.env.PORT || 3000;

const app = express();
const db = new sqlite3.Database('./db/chinook.sqlite');

console.log('# of invoices per country');


app.get('/invoices-by-country', (req, res) => {
    db.all(`
        SELECT   COUNT(*) AS count,
                BillingCountry AS country
        FROM     Invoice
        GROUP BY BillingCountry
        ORDER BY count DESC`,
        (err, data) => {
            if (err) throw err;

            // express added a JSON.stringify to this response
            res.send({
                data: data,
                info: '# of invoices per country'
            });
        }
    );
});


// How many Invoices were there in 2009 and 2011? What are the respective total sales for each of those years?
app.get('/salesPerYear', (req, res) => {
    db.all(`
        SELECT  COUNT(*) AS invoices,
                SUM(Total) as total,
                substr(InvoiceDate, 1, 4) as year
        FROM    Invoice
        GROUP BY year`,
            (err, data) => {
                if(err) throw err;

                    const roundedData = data.map(function (obj) {
                        return {
                            invoices: obj.invoices,
                            year: +obj.year,
                            total: +obj.total.toFixed(2)
                        }
                    });

                    res.send({
                        data: roundedData,
                        info: '# of invoices and sales per year'
                    });
            }
    );
});



app.listen(PORT, () => {
    console.log(`Express server listening on port: ${PORT}`);
});
