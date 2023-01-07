import React, { useEffect } from 'react';
import { Fab } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { FacebookLoginClient } from './facebook-login.client';
import {
    DialogParams,
    InitParams,
    LoginOptions,
    FacebookLoginProps,
} from './types';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4267B2',
        },
    },
});

export default function FacebookLogin(props: FacebookLoginProps) {
    const {
        appId,
        language = 'en_US',
        scope = 'public_profile, email',
        fields = 'name,email,picture',
        onSuccess,
        onFail,
        onProfileSuccess,
        className,
        style,
        render,
        autoLoad = false,
        useRedirect = false,
        useCustomerChat = false,
    } = props;

    const initParams: InitParams = {
        version: 'v9.0',
        xfbml: false,
        cookie: false,
        localStorage: true,
        ...props.initParams,
        appId,
    };
    const dialogParams: DialogParams = {
        redirect_uri:
        typeof window !== 'undefined' ? location.origin + location.pathname : '/',
        state: 'facebookdirect',
        response_type: 'code',
        ...props.dialogParams,
        client_id: appId,
    };
    const loginOptions: LoginOptions = {
        return_scopes: false,
        ignoreSdkError: false,
        ...props.loginOptions,
        auth_nonce:
        typeof props.loginOptions?.auth_nonce === 'function'
        ? props.loginOptions.auth_nonce()
        : props.loginOptions?.auth_nonce,
        scope,
    };

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        await FacebookLoginClient.loadSdk(language, useCustomerChat);
        window.fbAsyncInit = () => {
            FacebookLoginClient.init(initParams);
            const isRedirected = FacebookLoginClient.isRedirected(dialogParams);
            if (isRedirected === false && autoLoad) {
                handleButtonClick();
                return;
            }
            if (isRedirected === true && useRedirect) {
                requestLogin();
            }
        };
    };

    const requestLogin = () => {
        FacebookLoginClient.login(
            (res) => {
                if (!res.authResponse) {
                    onFail && onFail({ status: 'loginCancelled' });
                    return;
                }

                onSuccess && onSuccess(res.authResponse);

                if (onProfileSuccess) {
                    FacebookLoginClient.getProfile(onProfileSuccess, { fields });
                }
            },
            { ...loginOptions, scope }
        );
    };

    const handleButtonClick = () => {
        if (useRedirect) {
            FacebookLoginClient.redirectToDialog(dialogParams, loginOptions);
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
            logout: FacebookLoginClient.logout,
        });
    }

    return (
        <ThemeProvider theme={theme}>
        <Fab
        color="primary"
        onClick={handleButtonClick}
        className={className}
        style={style}
    >
        <FacebookIcon />
        </Fab>
        </ThemeProvider>
    );
}
