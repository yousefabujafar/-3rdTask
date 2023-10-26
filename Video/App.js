import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';

class VideoCaptureApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      videoUri: null,
      videoDuration: 0,
    };
  }

  startRecording = async () => {
    if (this.camera) {
      try {
        this.setState({ isRecording: true });
        const options = {
          quality: RNCamera.Constants.VideoQuality['1080p'],
          maxDuration: 10, // Maximum length of the video (in seconds)
        };
        const data = await this.camera.recordAsync(options);
        this.saveVideo(data.uri);
      } catch (error) {
        console.error(error);
      }
    }
  };

  stopRecording = () => {
    if (this.camera) {
      this.camera.stopRecording();
      this.setState({ isRecording: false });
    }
  };

  saveVideo = async (videoUri) => {
    const destPath = RNFS.DownloadDirectoryPath + '/capturedVideo.mp4';
    try {
      await RNFS.copyFile(videoUri, destPath);
      console.log('Video saved to: ' + destPath);
      this.setState({ videoUri: destPath });
    } catch (error) {
      console.error('Error saving video: ' + error);
    }
  };

  onVideoLoad = (data) => {
    // Get the duration of the video
    this.setState({ videoDuration: data.duration });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.videoUri ? (
          <Video
            source={{ uri: this.state.videoUri }}
            style={{ flex: 1 }}
            onEnd={() => {
              // Video playback has ended
            }}
            onLoad={this.onVideoLoad}
          />
        ) : (
          <RNCamera ref={(ref) => (this.camera = ref)} style={{ flex: 1 }} />
        )}
        <Text>Video Duration: {this.state.videoDuration} seconds</Text>
        <TouchableOpacity onPress={this.state.isRecording ? this.stopRecording : this.startRecording}>
          <Text>{this.state.isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default VideoCaptureApp;
