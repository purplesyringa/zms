import ZeroFrame from "zero-dev-lib/ZeroFrame";
export const zeroFrame = new ZeroFrame();

import ZeroPage from "zero-dev-lib/ZeroPage";
export const zeroPage = new ZeroPage(zeroFrame);

import ZeroFS from "zero-dev-lib/ZeroFS";
export const zeroFS = new ZeroFS(zeroPage);

import ZeroDB from "zero-dev-lib/ZeroDB";
export const zeroDB = new ZeroDB(zeroPage);

import ZeroID from "zero-dev-lib/ZeroID";
export const zeroID = new ZeroID(zeroPage);

import ZeroAuth from "zero-dev-lib/ZeroAuth";
export const zeroAuth = new ZeroAuth(zeroPage, ["zeroid.bit", "kaffie.bit"]);
zeroPage.auth = zeroAuth;