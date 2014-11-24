package com.foodmania.main;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.Toast;

import com.foodmania.R;
import com.foodmania.main.database.CredentialsDataSource;
import com.foodmania.main.database.entities.Credentials;
import com.foodmania.main.entities.Server;
import com.foodmania.main.entities.User;
import com.foodmania.main.login.FragmentLogin;
import com.foodmania.main.login.FragmentRegister;
import com.foodmania.main.tools.ConnectionDetector;
import com.foodmania.main.tools.FragmentErrorDisplay;
import com.foodmania.main.tools.HttpRequest;

public class MainActivity extends FragmentActivity implements OnClickListener {

	public Button				mCreateAccount;
	
	public boolean				canExit = true;
	
	private Thread 				mTryConnect = new Thread(new Runnable() {
		final HttpRequest httpRequest = new HttpRequest();
		
		@Override
		public void run() {
			CredentialsDataSource datasource = new CredentialsDataSource(MainActivity.this);
			ConnectionDetector connectionDetector = new ConnectionDetector(MainActivity.this);
			
			datasource.open();
			Credentials credentials = datasource.getCredentials();
			
			/*if (!httpRequest.isServerRunnig(Server.R_ROOT) || !connectionDetector.isConnectingToInternet()) {
				FragmentTransaction ft = getSupportFragmentManager().beginTransaction();
				Fragment errorDisplay = new FragmentErrorDisplay(!connectionDetector.isConnectingToInternet() ? R.string.noConnectionError : R.string.serverUnreachableError);
			
				ft.replace(R.id.errorDisplay, errorDisplay);
				ft.commit();
				datasource.close();
				
				return;
			} else if (credentials != null && User.gUser.isConnected(credentials.getToken(), credentials.getEmail())) {
			    Toast.makeText(getApplicationContext(), "CONNECTED : " + credentials.getToken(), Toast.LENGTH_LONG).show();
			} else {*/
				mCreateAccount.post(new Runnable() {
			        public void run() {
			        	FragmentTransaction ft = getSupportFragmentManager().beginTransaction();
			        	Fragment errorDisplayFragment = getSupportFragmentManager().findFragmentById(R.id.errorDisplay);
			        	Fragment loginSonaFragment = new FragmentLogin();
			        	
			        	if (errorDisplayFragment != null) {
			        		ft.remove(errorDisplayFragment);
			        	}
			        	ft.replace(R.id.accountManager, loginSonaFragment);
			    		ft.commit();
			    	
			    		mCreateAccount.setVisibility(View.VISIBLE);
			        }
			    });
			/*}*/
			datasource.close();
		}
	});
	  
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		mCreateAccount = (Button) findViewById(R.id.createAccount);
		
		mCreateAccount.setOnClickListener(this);
	}

	@Override
	protected void onPause() {
		super.onPause();
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		
		if (mTryConnect.getState() != Thread.State.NEW) {
			mTryConnect.run();
		} else {
			mTryConnect.start();
		}
	}
	
	@Override
	public void onBackPressed() {
		if (canExit) {
			super.onBackPressed();
			finish();
		} else {
			FragmentRegister fRegister = (FragmentRegister) getSupportFragmentManager().findFragmentById(R.id.accountManager);
			
			if (fRegister != null) {
				fRegister.cancel();
			}
			canExit = true;
			mCreateAccount.setVisibility(View.VISIBLE);
		}
	}

	@Override
	public void onClick(View v) {
		FragmentTransaction ft = getSupportFragmentManager().beginTransaction();
		
		switch (v.getId()) {
		case R.id.createAccount:
			Fragment registerSonaFragment = new FragmentRegister();
		
			ft.replace(R.id.accountManager, registerSonaFragment);
			ft.addToBackStack(null);
			ft.commit();
			
			mCreateAccount.setVisibility(View.GONE);
			break;
		}
		canExit = false;
	}
}