
import { GridGainMessage } from "@/components/gridgain/GridGainData";

export interface ServerDetail {
  HostId: string;
  DcName: string;
  DcUri: string;
}

export interface GridGainApiResponse {
  CallId: string;
  Result: string;
  ErrorDescription: string;
  ServerDetails: ServerDetail[];
}

export interface GridGainViewerProps {
  environmentName: string;
}
