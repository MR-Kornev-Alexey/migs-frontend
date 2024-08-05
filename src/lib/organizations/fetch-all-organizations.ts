import {organizationClient} from '@/lib/organizations/organization-client';
import {type Data} from "@/types/result-api";

export async function fetchAllOrganizations(): Promise<Data[]> {
  return await organizationClient.getAllOrganization();
}
