declare namespace Voo {
  export namespace http {
    export interface Picture {
      Value: string;
      type: string;
    }

    export interface Pictures {
      Picture: Picture[];
    }

    export interface Channel {
      id: string;
      LogicalChannelNumber: number;
      Name: string;
      Pictures: Pictures;
      IsViewableOnCpe: boolean;
    }

    export interface Channels {
      resultCount: number;
      Channel: Channel[];
    }

    export interface ChannelListResponse {
      Channels: Channels;
    }
  }

  export namespace upnp {
    export interface MediaInfo {
      NrTracks: string;
      MediaDuration: string;
      CurrentURI: string;
    }

    type TransportState =
      | "STOPPED"
      | "PAUSED_PLAYBACK"
      | "PAUSED_RECORDING"
      | "PLAYING"
      | "RECORDING"
      | "TRANSITIONING"
      | "NO_MEDIA_PRESENT";

    type TransportStatus = "OK" | "ERROR_OCCURRED";

    export interface TransportInfo {
      CurrentTransportState: TransportState;
      CurrentTransportStatus: TransportStatus;
      CurrentSpeed: string;
    }
  }
}
