# senate twitter scraper
First get your API keys by creating a new project at https://developer.twitter.com/en/portal  
Then copy the API key, API key secret, and Bearer Token into toknes.json and place it in this directory  
Then execute each JS file by `node xxx.js`. the result will appear in the terminal stdout  
Execution order is numbered. number depends on smaller number's result  
No dependency required other than node.js builtin  

# tokens.json example
```json
{
    "API_key": "akjgKHGFFDflJHLjkshgdlJKGDhj",
    "API_key_secret": "GK7H2H3L6KIUhoGO2iy6tg3y6uGug8p5ygUG3OY0gY4uo2G5Yo75uYG",
    "Bearer_Token": "AAAAAAAAAAAAAAAAAAOYGyi1ugK233Hk6fyTY3DFJH8g9d3i3h5gKBVl7jh2gYkhj5hgk2KUGkjg8RYk2FHg5FGj8jHG3KHgk"
}
```

# playground.js
To run `playground.js`, I recommend you install `node-repl` from https://github.com/martian17/node-repl  
This will provide interactive shell where you can execute request commands like this:  
```bash
$ node-repl playground.js 
> response = await request_async({hostname:"api.twitter.com",port:443,path:"/2/lists/63915645/members",method:"GET",headers:{"Authorization": `Bearer ${Bearer_Token}`}});result = await get_response_body(response);
{... some JSON result}
```