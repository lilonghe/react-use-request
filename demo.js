import React, { useEffect, useState } from 'react';
import useRequest from './useRequest';

const objToQuery = (obj) => {
    var str = [];
    for (let p in obj)
     if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
     }
    return str.join("&");
}

// 一般系统中会对请求做一次封装
const request = (url, useOptions={}) => {
  let options = {
    method: 'get',
    credentials: 'include',
    ...useOptions,
  }
  if (options.query) {
    url += "?"+objToQuery(options.query);
  }
  if (options.body) {
    options.body = JSON.stringify(options.body);
  }
  return fetch(url, options).
    then(res=>res.json()).
    catch(err=>{
      console.log(err)
      // 如果这里已经封装，那么 useFetch 将不会得到 error，需要自行处理
      return {err: '错误'}
    });
}

const homeService = (params) => {
  return request('http://rap2api.taobao.org/app/mock/262830/home', { query: params });
}

// 忽略了错误的 fetch
const homeService2 = (params) => {
  return request('http://rap2api.taobao.org/app/mock/262830/home?'+objToQuery(params));
}

const sendService = (params) => {
  return request('http://rap2api.taobao.org/app/mock/262830/message', { method: 'post', body: params });
}

function App() {
  const [nodeList, setNodeList] = useState([]);
  const [nodeParams, setNodeParams] = useState({});
  const { loading, error, data } = useRequest(homeService, { params: nodeParams });
  const { loading: loadingAdd, refetch: sendMessage } = useRequest(sendService, { enable: false })

  useEffect(()=>{
    if (data && !data.err) {
      setNodeList(data.data.nodes);
    }
  }, [data])

  if (loading) return "loading";
  if (error) return "error";
  if (loadingAdd) return "loading add";

  // 针对自行封装了 fetch 的 error 处理
  if(data && data.err) return "handle user error";

  return (
    <div className="App">
      <div>
        <button onClick={()=> {
          sendMessage({ name: "hello" + Math.random() });
        }}> Add </button>
      </div>

      <button onClick={()=> {
        setNodeParams({...nodeParams, key: Math.random()})
      }}> ChangeFilter </button>

      <div>
        <ul>
          {nodeList.map(item=><li key={item.id}>{item.id}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;