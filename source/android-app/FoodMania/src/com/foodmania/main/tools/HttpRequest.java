package com.foodmania.main.tools;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.AsyncTask;
import android.util.Log;

import com.foodmania.main.entities.Server;

public class HttpRequest {
	
	public int						mStatus = 0;
	public JSONObject 				mJsonResult = null;
	private static HttpClient 		httpclient = new DefaultHttpClient();
	
	public HttpRequest() {
	}
	
	public boolean get(String uri) {
		final GetRequest request = new GetRequest();
		
		try {
			request.execute(uri).get(10, TimeUnit.SECONDS);
		} catch (InterruptedException | ExecutionException | TimeoutException e) {
			if (e instanceof InterruptedException) {
				Log.e(getClass().getName() + " : InterruptedException", "error = " + e);
			} else if (e instanceof ExecutionException) {
				Log.e(getClass().getName() + " : ExecutionException", "error = " + e);  
			} else if (e instanceof TimeoutException) {
				Log.e(getClass().getName() + " : TimeoutException", "error = " + e);
				
				return false;
			}
		}
		
		return true;
	}
	
	public boolean post(String...data) {
		final PostRequest request = new PostRequest();
		
		try {
			request.execute(data).get(10, TimeUnit.SECONDS);
		} catch (InterruptedException | ExecutionException | TimeoutException e) {
			if (e instanceof InterruptedException) {
				Log.e(getClass().getName() + " : InterruptedException", "error = " + e);
			} else if (e instanceof ExecutionException) {
				Log.e(getClass().getName() + " : ExecutionException", "error = " + e);  
			} else if (e instanceof TimeoutException) {
				Log.e(getClass().getName() + " : TimeoutException", "error = " + e);
				
				return false;
			}
		}
		
		return true;
	}
	
	public boolean isServerRunnig(String serverRoot) {
		final GetRequest request = new GetRequest();
		
		try {
			request.execute(serverRoot).get(5, TimeUnit.SECONDS);
		} catch (InterruptedException | ExecutionException | TimeoutException e) {
			if (e instanceof InterruptedException) {
				Log.e(getClass().getName() + " : InterruptedException", "error = " + e);
			} else if (e instanceof ExecutionException) {
				Log.e(getClass().getName() + " : ExecutionException", "error = " + e);  
			} else if (e instanceof TimeoutException) {
				Log.e(getClass().getName() + " : TimeoutException", "error = " + e);
				
				return false;
			}
		}
		
		return (mStatus != -1 ? true : false);
	}
	
	private class GetRequest extends AsyncTask<String, String, String>{
	
	    @Override
	    protected String doInBackground(String... data) {
	        HttpResponse 	response = null;
	        String 			responseString = null;
	        
	        try {
	            response = httpclient.execute(new HttpGet(data[0]));
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                response.getEntity().writeTo(out);
                out.close();
                responseString = out.toString();
                //response.getEntity().getContent().close();
	        } catch (ClientProtocolException e) {
	            Log.e(getClass().getName() + " : ClientProtocolExeption", "error = " + e);
	        } catch (IOException e) {
	        	Log.e(getClass().getName() + " : IOException", "error = " + e);
	        	if(e.getMessage().startsWith("Connection to http://") && e.getMessage().endsWith("refused")) {
		        	mStatus = -1;
	        		putJsonMesage("Server not found"); 
	        		return responseString;
		        }
	        }
	       
	        mStatus = response.getStatusLine().getStatusCode();
	        Log.e("get", "status = " + mStatus + " message = " + response.getStatusLine().getReasonPhrase());
	        /*if (mStatus == 401) {
	        	putJsonMesage("Unauthorized");
	        	return responseString; 
	        }*/
	        
	    	try {
	    		mJsonResult = new JSONObject(responseString);
			} catch (JSONException e) {
				Log.e(getClass().getName() + " : JSONException", "error = " + e);
			}
	        
	        return responseString;
	    }
	}
	    
    private class PostRequest extends AsyncTask<String, String, String>{
    	
	    @Override
	    protected String doInBackground(String... data) {
	        HttpPost 		httppost = new HttpPost(data[0]);
	        HttpResponse 	response = null;
	        String 			responseString = null;
	        
	        try {
				List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
				for (int i = 1; i < data.length; i += 2) {
					nameValuePairs.add(new BasicNameValuePair(data[i], data[i + 1]));
				}
				httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

				response = httpclient.execute(httppost);
				ByteArrayOutputStream out = new ByteArrayOutputStream();
                response.getEntity().writeTo(out);
                out.close();
                responseString = out.toString();
	        } catch (ClientProtocolException e) {
	        	Log.e(getClass().getName() + " : ClientProtocolExeption", "error = " + e);
			} catch (IOException e) {
				Log.e(getClass().getName() + " : IOException", "error = " + e);
			}
			
	        mStatus = response.getStatusLine().getStatusCode();
	        Log.e("post", "status = " + mStatus + " message = " + response.getStatusLine().getReasonPhrase());
	        if (mStatus == Server.ER_UNAUTHORIZED) {
	        	putJsonMesage("Unauthorized");
	        	return responseString; 
	        }
	        
	    	try {
	    		mJsonResult = new JSONObject(responseString);
			} catch (JSONException e) {
				Log.e(getClass().getName() + " : JSONException", "error = " + e);
			}
	    	
	        return responseString;
	    }
    }
        
    private void putJsonMesage(String message) {
    	mJsonResult = new JSONObject();
    	try {
			mJsonResult.put("message", message);
		} catch (JSONException e) {
			Log.e(getClass().getName() + " : JSONException", "error = " + e);
		}
    }
}
