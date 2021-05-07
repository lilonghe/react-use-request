# useRequest
Hooks for fetching data in React.

- 基于旧项目封装的 request
- 最简化使用
- 可配置手动或自动请求

# Install
```
npm install @lilonghe/react-use-request
```

# Usage
```
const { loading, error, data, refetch } = useRequest(fetcher, options);

useEffect(()=>{
    if (data) {
      console.log(data)
    }
}, [data])
```
view `demo.js`

## Options

### enable
default=true  
auto request.

### enableParam
default=true  
when params change, will auto request, overlay `enable`.

### params
params will pass to `fetcher`.

## Response 

### refetch
refetch don't use create options params, please use `refetch(params)` of request again.

### error
catch `fetcher` error.

### data
response of `fetcher`.

## loading
when request is `true`.

## onSuccess
when response data `onSuccess(response)`

## onError
when catch error `onError(error)`

## onFinish
when request end `onFinish`

## multiParam
adapter `func(p1,p2)`, use of `refetch([p1, p2])`