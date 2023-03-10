"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const Facebook_1 = __importDefault(require("@mui/icons-material/Facebook"));
const facebook_login_client_1 = require("./facebook-login.client");
const styles_1 = require("@mui/material/styles");
const theme = (0, styles_1.createTheme)({
    palette: {
        primary: {
            main: '#4267B2',
        },
    },
});
function FacebookLogin(props) {
    var _a, _b;
    const { appId, language = 'en_US', scope = 'public_profile, email', fields = 'name,email,picture', onSuccess, onFail, onProfileSuccess, className, style, render, autoLoad = false, useRedirect = false, useCustomerChat = false, } = props;
    const initParams = Object.assign(Object.assign({ version: 'v9.0', xfbml: false, cookie: false, localStorage: true }, props.initParams), { appId });
    const dialogParams = Object.assign(Object.assign({ redirect_uri: typeof window !== 'undefined' ? location.origin + location.pathname : '/', state: 'facebookdirect', response_type: 'code' }, props.dialogParams), { client_id: appId });
    const loginOptions = Object.assign(Object.assign({ return_scopes: false, ignoreSdkError: false }, props.loginOptions), { auth_nonce: typeof ((_a = props.loginOptions) === null || _a === void 0 ? void 0 : _a.auth_nonce) === 'function'
            ? props.loginOptions.auth_nonce()
            : (_b = props.loginOptions) === null || _b === void 0 ? void 0 : _b.auth_nonce, scope });
    (0, react_1.useEffect)(() => {
        init();
    }, []);
    const init = () => __awaiter(this, void 0, void 0, function* () {
        yield facebook_login_client_1.FacebookLoginClient.loadSdk(language, useCustomerChat);
        window.fbAsyncInit = () => {
            facebook_login_client_1.FacebookLoginClient.init(initParams);
            const isRedirected = facebook_login_client_1.FacebookLoginClient.isRedirected(dialogParams);
            if (isRedirected === false && autoLoad) {
                handleButtonClick();
                return;
            }
            if (isRedirected === true && useRedirect) {
                requestLogin();
            }
        };
    });
    const requestLogin = () => {
        facebook_login_client_1.FacebookLoginClient.login((res) => {
            if (!res.authResponse) {
                onFail && onFail({ status: 'loginCancelled' });
                return;
            }
            onSuccess && onSuccess(res.authResponse);
            if (onProfileSuccess) {
                facebook_login_client_1.FacebookLoginClient.getProfile(onProfileSuccess, { fields });
            }
        }, Object.assign(Object.assign({}, loginOptions), { scope }));
    };
    const handleButtonClick = () => {
        if (useRedirect) {
            facebook_login_client_1.FacebookLoginClient.redirectToDialog(dialogParams, loginOptions);
            return;
        }
        if (!window.FB) {
            onFail && onFail({ status: 'facebookNotLoaded' });
            return;
        }
        requestLogin();
    };
    if (render) {
        return render({
            onClick: handleButtonClick,
            logout: facebook_login_client_1.FacebookLoginClient.logout,
        });
    }
    return (react_1.default.createElement(styles_1.ThemeProvider, { theme: theme },
        react_1.default.createElement(material_1.Fab, { color: "primary", onClick: handleButtonClick, className: className, style: style },
            react_1.default.createElement(Facebook_1.default, null))));
}
exports.default = FacebookLogin;
