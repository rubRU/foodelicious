package com.foodmania.main.login;

import org.json.JSONException;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

import com.foodmania.R;
import com.foodmania.main.MainActivity;
import com.foodmania.main.database.CredentialsDataSource;
import com.foodmania.main.entities.HttpRequest;
import com.foodmania.main.entities.Server;

public class FragmentLogin extends Fragment implements OnClickListener {

	private static final String	TAG = "FragmentLogin";
	
	private FragmentActivity 	mActivity;

	private EditText			mEmail;
	private EditText			mPassword;
	
	private ImageView			mEmailError;
	private ImageView			mPasswordError;
	
	private Button 				mSubmit;
	
	@Override
	public void onAttach (Activity activity) {
		super.onAttach(activity);
		this.mActivity = (FragmentActivity) activity;
	}
	
	public FragmentLogin() {
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		View rootView = inflater.inflate(R.layout.fragment_login, container, false);

		mEmail = (EditText) rootView.findViewById(R.id.email);
		mPassword = (EditText) rootView.findViewById(R.id.password);
		mEmailError = (ImageView) rootView.findViewById(R.id.emailError);
		mPasswordError = (ImageView) rootView.findViewById(R.id.passwordError);
		mSubmit = (Button) rootView.findViewById(R.id.submit);
		
		mSubmit.setOnClickListener(this);
		
		return rootView;
	}

	@Override
	public void onClick(View v) {
		switch (v.getId()) {
		case R.id.submit:
			login();
			break;
		}
	}
	
	public void login() {
		String email = mEmail.getText().toString();
		String password = mPassword.getText().toString();
		
		HttpRequest.post(Server.R_LOGIN, 
				"email", email,
				"password", password);
		if (HttpRequest.getJsonResult() != null && HttpRequest.getStatus() == Server.SU_OK) {
			try {
				CredentialsDataSource datasource = new CredentialsDataSource(mActivity);
				
				datasource.open();
				if (datasource.getCredentials() != null) {
					datasource.deleteCredentials(datasource.getCredentials());
				}
				datasource.createCredentials(HttpRequest.getJsonResult().getString("id"), HttpRequest.getJsonResult().getString("token"));
				datasource.close();
				setError(HttpRequest.getJsonResult().getInt("code"));
			} catch (JSONException e) {
				Log.e(TAG, "JSONException: error = " + e);
				
				mActivity.startActivity(new Intent(mActivity, MainActivity.class)
					.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP));
			}
		}
	}
	
	public void cancel() {
		FragmentTransaction ft = mActivity.getSupportFragmentManager().beginTransaction();
		
		ft.remove(mActivity.getSupportFragmentManager().findFragmentById(R.id.accountManager));
		ft.commit();
	}
	
	private void setError(int error) {
		switch (error) {
		case Server.ER_INVALID_EMAIL:
			mEmailError.setVisibility(View.VISIBLE);
			break;
		case Server.ER_PASSWORD_TOO_SHORT:
			mPasswordError.setVisibility(View.VISIBLE);
			break;
		default:
			mEmailError.setVisibility(View.INVISIBLE);
			mPasswordError.setVisibility(View.INVISIBLE);
			break;
		}
	}
}
