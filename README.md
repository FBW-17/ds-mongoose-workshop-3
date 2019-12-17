# Mongoose API Workshop - Exercise 3 - Errors & Async Await

* Continue working on your code for flats from the previous exercises

## Add Error Handling

* Add error handling to your code
    * Catch errors (500 = server errors, e.g. mongoose errors)
        * Define generic error middleware: api.use((err, req, res, next) => {... your code ...})
    * Send all errors back as JSON!


## Refactor code: Use Async Await 

Refactor your app to use async await instead of then() and catch() handlers

* replace then() handlers by await
* replace catch() by a try-catch block
    * with a try-catch block you TRY some code. Meaning you execute code that could lead to an error. E.g. looking up a MongoDB document by ID but there exists no such document with that ID. All errors that are thrown within code in a try block will be caught by a catch() {} block
    * wrap your Mongoose operation in a try block, e.g.
            ```
            try {
                let obj = MyModel.findById(yourId)
            }
            catch(err) {
                ...                
            }
            ```
    * replace `.catch(err => {})` by `catch(err) {}` in your code
        * within the catch block: call next() with the received error (just like in your .catch() handler before)


