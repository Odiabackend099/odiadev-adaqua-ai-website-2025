/**
 * ODIADEV Adaqua AI Chat Widget
 * Embed script for external websites
 */

(function() {
  'use strict';

  // Configuration
  const WIDGET_VERSION = '1.0.0';
  const WIDGET_CDN_URL = 'https://odia.dev';
  const DEFAULT_CONFIG = {
    assistantId: null,
    persona: 'Ezinne',
    voiceEnabled: true,
    position: 'bottom-right',
    theme: 'dark'
  };

  // Widget state
  let widgetLoaded = false;
  let widgetInstance = null;
  let config = { ...DEFAULT_CONFIG };

  // Extract configuration from script tag
  function extractConfig() {
    const script = document.currentScript;
    if (!script) return config;

    // Get assistant ID from data-assistant attribute
    const assistantId = script.getAttribute('data-assistant');
    if (assistantId) {
      config.assistantId = assistantId;
    }

    // Get persona from data-persona attribute
    const persona = script.getAttribute('data-persona');
    if (persona && ['Ezinne', 'Lexi', 'ODIA', 'Atlas'].includes(persona)) {
      config.persona = persona;
    }

    // Get voice setting from data-voice attribute
    const voiceEnabled = script.getAttribute('data-voice');
    if (voiceEnabled !== null) {
      config.voiceEnabled = voiceEnabled === 'true';
    }

    // Get position from data-position attribute
    const position = script.getAttribute('data-position');
    if (position && ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(position)) {
      config.position = position;
    }

    return config;
  }

  // Create widget container
  function createWidgetContainer() {
    const container = document.createElement('div');
    container.id = 'odiadev-chat-widget';
    container.style.cssText = `
      position: fixed;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Set position based on config
    switch (config.position) {
      case 'bottom-left':
        container.style.bottom = '20px';
        container.style.left = '20px';
        break;
      case 'top-right':
        container.style.top = '20px';
        container.style.right = '20px';
        break;
      case 'top-left':
        container.style.top = '20px';
        container.style.left = '20px';
        break;
      default: // bottom-right
        container.style.bottom = '20px';
        container.style.right = '20px';
    }

    return container;
  }

  // Load widget styles
  function loadWidgetStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${WIDGET_CDN_URL}/widget.css`;
    link.onerror = () => {
      console.warn('ODIADEV: Could not load widget styles, using inline styles');
    };
    document.head.appendChild(link);
  }

  // Load React and widget components
  function loadWidgetScripts() {
    return new Promise((resolve, reject) => {
      // Load React
      const reactScript = document.createElement('script');
      reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
      reactScript.onload = () => {
        // Load React DOM
        const reactDOMScript = document.createElement('script');
        reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
        reactDOMScript.onload = () => {
          // Load widget bundle
          const widgetScript = document.createElement('script');
          widgetScript.src = `${WIDGET_CDN_URL}/widget-bundle.js`;
          widgetScript.onload = resolve;
          widgetScript.onerror = reject;
          document.head.appendChild(widgetScript);
        };
        reactDOMScript.onerror = reject;
        document.head.appendChild(reactDOMScript);
      };
      reactScript.onerror = reject;
      document.head.appendChild(reactScript);
    });
  }

  // Initialize widget
  function initializeWidget() {
    if (widgetLoaded) return;

    try {
      // Extract configuration
      config = extractConfig();

      // Create container
      const container = createWidgetContainer();
      document.body.appendChild(container);

      // Load styles
      loadWidgetStyles();

      // Load scripts and initialize
      loadWidgetScripts()
        .then(() => {
          // Initialize React widget
          if (window.React && window.ReactDOM && window.ODIADEVWidget) {
            const widgetElement = window.React.createElement(window.ODIADEVWidget, {
              assistantId: config.assistantId,
              persona: config.persona,
              voiceEnabled: config.voiceEnabled,
              theme: config.theme
            });

            window.ReactDOM.render(widgetElement, container);
            widgetLoaded = true;
            widgetInstance = container;

            console.log('ODIADEV Chat Widget loaded successfully', config);
          } else {
            throw new Error('Widget components not available');
          }
        })
        .catch((error) => {
          console.error('ODIADEV: Failed to load widget:', error);
          // Show fallback widget
          showFallbackWidget(container);
        });

    } catch (error) {
      console.error('ODIADEV: Widget initialization failed:', error);
    }
  }

  // Fallback widget for when React fails to load
  function showFallbackWidget(container) {
    container.innerHTML = `
      <div style="
        background: #132a52;
        color: white;
        border: 2px solid #b08d57;
        border-radius: 12px;
        padding: 16px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <div style="
            width: 24px;
            height: 24px;
            background: #b08d57;
            border-radius: 50%;
            margin-right: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: black;
            font-weight: bold;
          ">O</div>
          <span style="font-weight: 600;">Adaqua AI</span>
        </div>
        <p style="margin: 0 0 12px 0; font-size: 14px; opacity: 0.9;">
          Chat with ODIADEV's AI assistant
        </p>
        <a href="https://odia.dev" target="_blank" style="
          display: inline-block;
          background: #b08d57;
          color: black;
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        ">Open Chat</a>
      </div>
    `;
  }

  // Public API
  window.ODIADEV = {
    version: WIDGET_VERSION,
    config: config,
    load: initializeWidget,
    destroy: function() {
      if (widgetInstance) {
        widgetInstance.remove();
        widgetLoaded = false;
        widgetInstance = null;
      }
    }
  };

  // Auto-initialize if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }

})();
