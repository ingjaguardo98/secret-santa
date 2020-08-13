import { LitElement, html, css } from 'lit-element';
import '@material/mwc-button'
import '@material/mwc-textfield';
import '@material/mwc-icon-button';
import '@material/mwc-icon';
import '@material/mwc-list/mwc-list-item.js';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-top-app-bar';

export class SecretSanta extends LitElement {
  static get styles() {
    return css
    `
      .draw-result {
        font-size: 1.5rem;
      }

      .avatar-icon {
        background-color: gray;
        color: white;
      }

      mwc-top-app-bar {
        --mdc-theme-primary: orange;
        --mdc-theme-on-primary: black;
      }

      mwc-textfield {
        --mdc-theme-primary: orange;
        --mdc-theme-on-primary: black;
      }

      mwc-button {
        --mdc-theme-primary: orange;
        --mdc-theme-on-primary: black;
      }

      .container {
        display:flex;
        flex-direction: column;
        align-content:center;
        margin: 0 auto;
        max-width: 75vw;
        padding-top:10px;
      }

      .gifts {
        display:flex;
        flex-direction: column;
        justify-content: center;
      }
    `;
  }

  static get properties() {
    return {
      member: {type: String},
      memberList: {type: Array},
      gift: {type: Array},
      auxGift: {type: String},
      drawResults: {type: String},
      arrResults: {type: Array}
    };
  }

  constructor() {
    super();
    this.member = '';
    this.memberList = [];
    this.gift = [];
    this.auxGift = '';
    this.drawResults = '';
    this.arrResults = [];
  }


  addMember() {
    let objMember = {
      name: this.member,
      gifts: []
    }
    this.memberList = [...this.memberList, objMember];
    this.member = '';
    this.gift = [...this.gift, ''];
  }

  addGift(e) {
    console.log(e.target.id);
    this.memberList.map( (member, index) => {
      if (member.name === e.target.id) {
        member.gifts = [...member.gifts, this.gift[index]];
        this.gift[index] = '';
        this.auxGift = '';
      }
    });
    this.requestUpdate();
  }

  makeDraw() {
    let numberMembers = this.memberList.length;
    this.arrResults = this.memberList.map( (member,index) => {
      let next = index + 1;
      if (next < numberMembers) {
        return {
          de: member.name,
          para: this.memberList[next].name
        }
      } else {
        return {
          de: member.name,
          para: this.memberList[0].name
        };
      }
    });
    this.drawResults =
    html`
      <h2>¡El SORTEO ESTA LISTO!</h2>
      ${this.arrResults.map( result =>
        html`
            <p class="draw-result"><span style="color:green">${result.de}</span>
            le regala a <span style="color:red">${result.para}</span></p>
          `
        )}
    `
  }

  render() {
    return html`
      <mwc-top-app-bar centerTitle>
        <mwc-icon-button icon="menu" slot="navigationIcon"></mwc-icon-button>
        <div slot="title">Secret Santa</div>
        <mwc-icon-button icon="card_giftcard" slot="actionItems"></mwc-icon-button>
        <div><!-- content --></div>
      </mwc-top-app-bar>
      <div class="container">
        <mwc-textfield  label="Participante"
         helper="Escribe el nombre del participante"
         .value="${this.member}"
         @input="${e => {
            this.member = e.target.value;
          }
        }}"></mwc-textfield>
        <br/>
        <mwc-button
        ?disabled="${this.member === ''}"
        raised
        label="AGREGAR"
        @click="${this.addMember}">
        </mwc-button>
        <mwc-list>
          ${this.memberList.map( (member, index) =>
            html`
                <mwc-list-item graphic="avatar">
                  <span>${member.name}</span>
                  <mwc-icon class="avatar-icon" slot="graphic">insert_emoticon</mwc-icon>
                </mwc-list-item>
                <li divider inset padded role="separator"></li>
                <div class="gifts">
                  <div>
                    <mwc-textfield label="Regalo"
                      .value="${this.gift[index]}"
                      @input="${e => {
                          this.gift[index] = e.target.value;
                          this.auxGift = e.target.value;
                        }
                      }">
                      </mwc-textfield>&nbsp;&nbsp;
                    <mwc-button
                      id="${member.name}"
                      ?disabled="${this.auxGift === ''}"
                      raised
                      label="AGREGAR"
                      @click="${this.addGift}">
                    </mwc-button>
                  </div>
                  <div>
                    <mwc-list>
                      ${member.gifts.map( gift =>
                      html`
                        <mwc-list-item hasMeta>
                          <span>${gift}</span>
                          <mwc-icon slot="meta">card_giftcard</mwc-icon>
                        </mwc-list-item>
                        `
                      )}
                    </mwc-list>
                  </div>
                </div>
              `
          )}
          </mwc-list>
          <mwc-button
            ?disabled="${this.memberList.length < 2}"
            raised
            label="HACER SORTEO"
            @click="${this.makeDraw}">
          </mwc-button>
          ${this.drawResults}
      </div>
    `;
  }
}

customElements.define('secret-santa', SecretSanta);