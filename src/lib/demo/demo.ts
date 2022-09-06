import AxiosWrapper from './axiosWrapper';
import DemoServer from './demoServer';
import './socketWrapper';
import SocketWrapper from './socketWrapper';

/**
 * Demo class.
 */
class Demo {
  private static axios: AxiosWrapper;
  private static server: DemoServer;

  /**
   * Initialize the demo.
   */
  static initialize(): void {
    SocketWrapper.wrap();
    this.server = new DemoServer();
    this.axios = new AxiosWrapper(this.server);
  }
}

export default Demo;
