<section id="chat-area" style="display:none">

  <section class="card">
    <h2>Configuração de Chat</h2>

    <!-- TIPO -->
    <div class="chat-section">
      <h3>Tipo de Integração</h3>
      <div class="chat-grid">
        <div class="chat-card" onclick="selecionarTipoChat('api')">
          <img src="./assets/meta.png">
          <h4>API Oficial</h4>
        </div>

        <div class="chat-card" onclick="selecionarTipoChat('qr')">
          <img src="./assets/whatsapp.png">
          <h4>QR Code</h4>
        </div>
      </div>
    </div>

    <!-- API OFICIAL -->
    <div id="api-oficial" class="chat-section" style="display:none">
      <h3>Fornecedor</h3>
      <div class="chat-grid">
        <div class="chat-card" onclick="selecionarApi('meta')">
          <img src="./assets/meta.png">
          <h4>Meta</h4>
        </div>

        <div class="chat-card" onclick="selecionarApi('360')">
          <img src="./assets/360.png">
          <h4>360</h4>
        </div>

        <div class="chat-card" onclick="selecionarApi('gupshup')">
          <img src="./assets/gupshup.png">
          <h4>Gupshup</h4>
        </div>
      </div>
    </div>

    <!-- CANAIS -->
    <div id="chat-canais" class="chat-section" style="display:none">
      <h3>Canais Integrados</h3>
      <div class="chat-grid">
        <div class="chat-card" onclick="toggleCanal('whatsapp')">
          <img src="./assets/whatsapp.png">
          <h4>WhatsApp</h4>
        </div>

        <div class="chat-card" onclick="toggleCanal('instagram')">
          <img src="./assets/instagram.png">
          <h4>Instagram</h4>
        </div>

        <div class="chat-card" onclick="toggleCanal('messenger')">
          <img src="./assets/messenger.png">
          <h4>Messenger</h4>
        </div>

        <div class="chat-card" onclick="toggleCanal('telegram')">
          <img src="./assets/telegram.png">
          <h4>Telegram</h4>
        </div>

        <div class="chat-card" onclick="toggleCanal('email')">
          <img src="./assets/email.png">
          <h4>E-mail</h4>
        </div>
      </div>
    </div>

    <!-- QR CODE -->
    <div id="chat-qr" class="chat-section" style="display:none">
      <h3>Número do WhatsApp</h3>
      <input class="chat-input" placeholder="Ex: 5511999999999">
    </div>

  </section>
</section>
