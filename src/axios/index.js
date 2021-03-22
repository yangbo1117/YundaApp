
import axios from 'axios'
import { Modal } from 'antd'
// let baseApi ='http://aoi.yundasys.com:8061/tv/';
let baseApi ='http://aoi.yundasys.com:8060/tv';
// let baseApi ='http://10.20.28.3:8060/tv';   
export default class Axios {
    static get(options){
      /*   let loading;
        if (options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        } */
        
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'get',
                baseURL:options.baseApi||baseApi,
                timeout:60000,
                params: (options.data) || '',
                withCredentials:options.withCredentials||false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
            }).then((response)=>{
               
                if (options.data && options.data.isShowLoading !== false) {
                    // loading = document.getElementById('ajaxLoading');
                    // loading.style.display = 'none';
                }
                if (response.status === 200){
                    let res = response.data;
                    if (res.code === '10000'||res.code=== 801){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.remark
                        })
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }

    static put(options){
        /*   let loading;
          if (options.data && options.data.isShowLoading !== false){
              loading = document.getElementById('ajaxLoading');
              loading.style.display = 'block';
          } */
          
          return new Promise((resolve,reject)=>{
              axios({
                  url:options.url,
                  method:'put',
                  baseURL:options.baseApi||baseApi,
                  timeout:60000,
                  params: (options.data) || '',
                  withCredentials:options.withCredentials||false
              }).then((response)=>{
                 
                  if (options.data && options.data.isShowLoading !== false) {
                      // loading = document.getElementById('ajaxLoading');
                      // loading.style.display = 'none';
                  }
                  if (response.status === 200){
                      let res = response.data;
                      if (res.code === '10000'||res.code=== 801){
                          resolve(res);
                      }else{
                          Modal.info({
                              title:"提示",
                              content:res.remark
                          })
                      }
                  }else{
                      reject(response.data);
                  }
              })
          });
      }

    static delete(options){
        /*   let loading;
          if (options.data && options.data.isShowLoading !== false){
              loading = document.getElementById('ajaxLoading');
              loading.style.display = 'block';
          } */
          
          return new Promise((resolve,reject)=>{
              axios({
                  url:options.url,
                  method:'delete',
                  baseURL:options.baseApi||baseApi,
                  timeout:60000,
                  params: (options.data) || '',
              }).then((response)=>{
                 
                  if (options.data && options.data.isShowLoading !== false) {
                      // loading = document.getElementById('ajaxLoading');
                      // loading.style.display = 'none';
                  }
                  if (response.status === 200){
                      let res = response.data;
                      if (res.code === '10000'){
                          resolve(res);
                      }else{
                          Modal.info({
                              title:"提示",
                              content:res.remark
                          })
                      }
                  }else{
                      reject(response.data);
                  }
              })
          });
      }
    static post(options){
        let loading;
        // axios.defaults.headers = {
        //     'Content-type': 'application/x-www-form-urlencoded'
        // }
        // if (options.data && options.data.isShowLoading !== false){
        //     loading = document.getElementById('ajaxLoading');
        //     loading.style.display = 'block';
        // }
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'post',
                timeout:60000,
                baseURL:options.baseApi||baseApi,
                withCredentials:options.withCredentials||false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data:options.data
            }).then((response)=>{
               
                if (options.data && options.data.isShowLoading !== false) {
                    // loading = document.getElementById('ajaxLoading');
                    // loading.style.display = 'none';
                }
                if (response.status === 200){
                    let res = response.data;
                    if (res.code === '10000'||res.code=== 801){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.remark
                        })
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }
}