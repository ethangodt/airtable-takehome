Hello! I just wanted to say that this take home was a fun challenge. I hope you'll enjoy my submission — would love to discuss it more.

### Running Things

Make sure you `npm install`. You can use `node ./src/main.js` to run my submission. Using it with the `check` command to test against all examples can be done with:
`./check node ./src/main.js -- examples/ examples/*.sql`
You'll need Node.js v12 or newer. I was using `v12.16.1`.
```
Checking "examples/cities-1.sql"...
Checking "examples/cities-2.sql"...
Checking "examples/cities-3.sql"...
Checking "examples/error-1.sql"...
Checking "examples/error-2.sql"...
Checking "examples/error-3.sql"...
Checking "examples/simple-1.sql"...
Checking "examples/simple-2.sql"...
Checking "examples/simple-3.sql"...
Passed: 9/9
```


### Explanation

tl;dr - `main()` in `main.js` is pretty self explanatory. `node` is a chain of iterators pulling rows through and modifying them one at a time. Everything is streamed individually to the output file.

When I read the prompt I had remembered this description of the iterator pattern commonly used in relational databases from a course I was taking. You can find it https://archive.org/details/ucberkeley_webcast_0iSHVyIlnH0 starting at 52:52 if you're interested. I decided that it would be a fun thing to try here.

The two main perks of using this pattern are:

- Each step of the execution of the query is separated by a generic interface allowing any two iterators to communicate with each other. This also allows ongoing fixes/improvements to each step of the query executor without affecting the overall program. We could easily add hash or merge joins to my submission ("easily"...).
- Results can be streamed from the DB heap file one row at a time. You don't need to wait for the result table to be complete before you start streaming a result. I'm streaming one row at a time to the ouput file in my submission.

I guess commonly the iterator pattern uses `.next()` to pass the data through, but I call it `.pull()` to help remind myself that the parent calls it when it wants to pull a row up from it's child, and not when a child is pushing data it is ready with to it's parent. i.e. Everything is pulled up by the parent asking for it, and not pushed up by the child saying it's ready with it.

![image](https://user-images.githubusercontent.com/11809142/83999552-d587a500-a917-11ea-9b4f-367608c80d7f.png)
