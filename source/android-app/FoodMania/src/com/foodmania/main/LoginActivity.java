package com.foodmania.main;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

import com.foodmania.R;
import com.foodmania.main.entities.HttpRequest;
import com.foodmania.main.entities.User;
import com.foodmania.main.entities.User.EGender;
import com.foodmania.main.login.FragmentRegister;
import com.foodmania.main.tools.ConnectionHandler;

public class LoginActivity extends FragmentActivity implements OnClickListener {

	private static final String 	TAG = "LoginActivity";
	
	public Button					mCreateAccount;
	
	public boolean					canExit = true;
	private Thread 					mTryConnect = new Thread(new ConnectionHandler(LoginActivity.this));
	public Handler					mHandler = new Handler() {
		@Override
        public void handleMessage(Message msg) {
			if (msg.getData().getBoolean("connected")) {
				startActivity(new Intent(LoginActivity.this, MainActivity.class));
			}
        }
	};
	  
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_login);

		mCreateAccount = (Button) findViewById(R.id.createAccount);
		
		mCreateAccount.setOnClickListener(this);
		
		HttpRequest.newHttpRequest();
		User.newUser("", "", "", "", EGender.m);
	}

	@Override
	protected void onPause() {
		super.onPause();
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		
		if (mTryConnect.getState() != Thread.State.NEW) {
			Log.e(TAG, "GONNA RUN");
			mTryConnect.run();
		} else {
			Log.e(TAG, "GONNA START");
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