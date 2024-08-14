'use client';

import { type ObjectFormInput } from '@/types/object-form-input';
import { BASE_URL } from '@/config';
import { getHeaders } from '@/lib/common-api/get-header';
import postData from "@/lib/common/post-data";

export class ObjectClient {
  // Helper function for making POST requests


  async initSignObject(formDataObject: ObjectFormInput) {
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
