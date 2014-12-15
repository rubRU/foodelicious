package com.foodmania.main.tools;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Message;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.View;

import com.foodmania.R;
import com.foodmania.main.LoginActivity;
import com.foodmania.main.MainActivity;
import com.foodmania.main.database.CredentialsDataSource;
import com.foodmania.main.database.entities.Credentials;
import com.foodmania.main.entities.HttpRequest;
import com.foodmania.main.entities.Server;
import com.foodmania.main.entities.User;
import com.foodmania.main.login.FragmentLogin;

public class ConnectionHandler implements Runnable {

	private static final String 	TAG = "ConnexionHandler";
	
	private Context 					mContext;
	
	public ConnectionHandler(Context context) {
		mContext = context;
	}
	
	@Override
	public void run() {
		CredentialsDataSource datasource = new CredentialsDataSource(mContext);
		ConnectionDetector connectionDetector = new ConnectionDetector(mContext);
		
		datasource.open();
		Credentials credentials = datasource.getCredentials();
		if (!HttpRequest.isServerRunnig(Server.R_ROOT) || !connectionDetector.isConnectingToInternet()) {
			FragmentTransaction ft = ((FragmentActivity) mContext).getSupportFragmentManager().beginTransaction();
			Fragment errorDisplay = new FragmentErrorDisplay(!connectionDetector.isConnectingToInternet() ? R.string.noConnectionError : R.string.serverUnreachableError);
		
			ft.replace(R.id.errorDisplay, errorDisplay);
			ft.commit();
			datasource.close();
			
			return;
		} else if (credentials != null && User.isConnected(credentials.getUserId(), credentials.getToken())) {
			Message m = new Message();
			Bundle b = new Bundle();
			
			b.putBoolean("connected", true);
			m.setData(b);
			((LoginActivity) mContext).mHandler.sendMessage(m);
		} else {
			((LoginActivity) mContext).mCreateAccount.post(new Runnable() {
		        public void run() {
		        	FragmentTransaction ft = ((FragmentActivity) mContext).getSupportFragmentManager().beginTransaction();
		        	Fragment errorDisplayFragment = ((FragmentActivity) mContext).getSupportFragmentManager().findFragmentById(R.id.errorDisplay);
		        	Fragment loginSonaFragment = new FragmentLogin();
		        	
		        	if (errorDisplayFragment != null) {
		        		ft.remove(errorDisplayFragment);
		        	}
		        	ft.replace(R.id.accountManager, loginSonaFragment);
		    		ft.commit();
		    	
		    		((LoginActivity) mContext).mCreateAccount.setVisibility(View.VISIBLE);
		        }
		    });
		}
		datasource.close();
	}
}
