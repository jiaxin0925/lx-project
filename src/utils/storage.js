import { FEATURE_NAME, NAVIGATOR } from './config';

export const storeMain = main => {
    return sessionStorage.setItem(FEATURE_NAME, JSON.stringify(main));
}

export const storeMenu = menu => {
    return sessionStorage.setItem(NAVIGATOR, JSON.stringify(menu));
}