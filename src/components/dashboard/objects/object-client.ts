'use client';

import { type ObjectFormInput } from '@/types/object-form-input';
import { BASE_URL } from '@/config';
import { getHeaders } from '@/lib/common-api/get-header';
import postData from "@/lib/common/post-data";
import {Values} from "zod";

export class ObjectClient {
  async deleteOneObject(objectId: string) {
    const getEmail = await getHeaders();
    const sendData = {
      email: getEmail.email,
      objectId,
    };
    return postData(`${BASE_URL}/objects/delete_one_object`, sendData, await getHeaders());
  }
  async initSignObject(formDataObject: any) {
    const getEmail = await getHeaders();
    const sendData = {
      email: getEmail.email,
      objectsData: formDataObject,
    };
    return postData(`${BASE_URL}/objects/create_new_object`, sendData, await getHeaders());
  }

  async getAllObjects() {
    const getEmail = await getHeaders();
    const sendData = {
      email: getEmail.email,
    };
    return postData(`${BASE_URL}/objects/get_all_objects`, sendData, await getHeaders());
  }
}

export const objectClient: ObjectClient = new ObjectClient();
