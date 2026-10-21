package com.reigninblood.idualremote;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override public void onCreate(android.os.Bundle savedInstanceState) {
    registerPlugin(ConsumerIrPlugin.class);
    super.onCreate(savedInstanceState);
  }}
