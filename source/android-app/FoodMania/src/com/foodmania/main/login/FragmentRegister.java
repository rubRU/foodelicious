package com.foodmania.main.login;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RadioGroup;

import com.foodmania.R;
import com.foodmania.main.MainActivity;
import com.foodmania.main.entities.Server;
import com.foodmania.main.tools.HttpRequest;

public class FragmentRegister extends Fragment implements OnClickListener {

	private FragmentActivity 	mActivity;
	
	private EditText			mName;
	private EditText			mLastName;
	private EditText			mEmail;
	private EditText			mPassword;
	
	private ImageView			mNameError;
	private ImageView			mLastNameError;
	private ImageView			mEmailError;
	private ImageView			mPasswordError;
	
	private Button 				mSubmit;
	private Button 				mCancel;
	
	private RadioGroup			mGender;
	
	@Override
	public void onAttach (Activity activity) {
		super.onAttach(activity);
		this.mActivity = (FragmentActivity) activity;
	}
	
	public FragmentRegister() {
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		View rootView = inflater.inflate(R.layout.fragment_register, container, false);

		mName = (EditText) rootView.findViewById(R.id.name);
		mLastName = (EditText) rootView.findViewById(R.id.lastName);
		mEmail = (EditText) rootView.findViewById(R.id.email);
		mPassword = (EditText) rootView.findViewById(R.id.password);
		mNameError = (ImageView) rootView.findViewById(R.id.nameError);
		mLastNameError = (ImageView) rootView.findViewById(R.id.lastNameError);
		mEmailError = (ImageView) rootView.findViewById(R.id.emailError);
		mPasswordError = (ImageView) rootView.findViewById(R.id.passwordError);
		mSubmit = (Button) rootView.findViewById(R.id.submit);
		mCancel = (Button) rootView.findViewById(R.id.cancel);
		mGender = (RadioGroup) rootView.findViewById(R.id.gender);
		
		mSubmit.setOnClickListener(this);
		mCancel.setOnClickListener(this);
		
		return rootView;
	}

	@Override
	public void onClick(View v) {
		switch (v.getId()) {
		case R.id.submit:
			createAccount();
			break;
		case R.id.cancel:
			cancel();
			break;
		}
	}

	public int createAccount() {
		String name = mName.getText().toString();
		String lastName = mLastName.getText().toString();
		String email = mEmail.getText().toString();
		String password = mPassword.getText().toString();
		String gender;

		gender = (mGender.getCheckedRadioButtonId() == R.id.male) ? "m" : "f";
		if (name.length() > 0 
				&& lastName.length() > 0
				&& email.length() > 0
				&& password.length() > 0) {
			final HttpRequest httpRequest = new HttpRequest();
			
			httpRequest.post(Server.R_SIGNUP, 
					"name", name,
					"lastName", lastName, 
					"email", email,
					"password", password,
					"gender", gender);
		} else {
			return (-1);
		}
		return (0);
	}
	
	public void cancel() {
		FragmentTransaction ft = mActivity.getSupportFragmentManager().beginTransaction();
		Fragment loginSonaFragment = new FragmentLogin();
    	
    	ft.replace(R.id.accountManager, loginSonaFragment);
		ft.remove(mActivity.getSupportFragmentManager().findFragmentById(R.id.accountManager));
		ft.commit();
		
		((MainActivity) mActivity).mCreateAccount.setVisibility(View.VISIBLE);
	}
}
