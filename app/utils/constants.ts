import { localStorageKey } from "@/constants/global";

// export const BASE_URL = 'https://saint-agustin.backend-dreametrix.com';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);

   

    const { primary_domain } = JSON.parse(tenantData);
    // const domain = ;
export const BACKEND_BASE_URL = `https://${primary_domain}`;
