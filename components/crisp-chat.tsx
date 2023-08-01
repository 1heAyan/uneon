"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("1db74731-bcc4-434d-a26b-5af206e0c6cb");
  }, []);

  return null;
};