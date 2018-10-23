<template>
  <div>
    <slot></slot>
  </div>
</template>
<script src="./vudalComponent">
</script>
<style>

  body.no-scroll {
    position: fixed;
    width: 100%;
    overflow: visible!important;
  }

  .modals.dimmer .ui.modal.mobile
  {
    position: initial!important;
  }

  .ui.modal.mobile
  {
    will-change: initial!important;
  }

  .vudal-dimmer {
    overflow: auto;
    display: none;
    position: fixed;
    top: 0!important;
    left: 0!important;
    width: 100%;
    height: 100%;
    text-align: center;
    vertical-align: middle;
    background-color: rgba(0,0,0,.85);
    opacity: 0;
    line-height: 1;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-duration: .5s;
    animation-duration: .5s;
    -webkit-transition: background-color .5s linear;
    transition: background-color .5s linear;
    will-change: opacity;
    z-index: 1000;
  }

  .vudal-dimmer.show {
    display: block;
    opacity: 1;
  }

  .vudal {
    position: absolute;
    z-index: 1001;
    top: 50%;
    left: 50%;
    background: white;
    width: 720px;
    margin: -300px 0 0 -360px;
    text-align: left;
    border-radius: .28571429rem;
    box-shadow: 1px 3px 3px 0 rgba(0,0,0,.2),1px 3px 15px 2px rgba(0,0,0,.2);
  }

  .vudal.wide {
    width: 90%;
  }

  .vudal.x-wide {
    width: 99%;
  }

  .vudal.narrow {
    width: auto;
    min-width: 250px;
  }

  .vudal.center {
    position: fixed;
  }

  .vudal.show {
    display: block;
  }

  .vudal.hide {
    display: none;
  }

  .vudal>.header {
    display: block;
    font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    background: #FFF;
    margin: 0;
    padding: 1.25rem 1.5rem;
    box-shadow: none;
    color: rgba(0,0,0,.85);
    border-bottom: 1px solid rgba(34,36,38,.15);
  }

  .vudal.alert>.header {
    border-bottom: none;
  }

  .vudal>.header:not(.ui) {
    font-size: 1.3em;
    line-height: 1.2857em;
    font-weight: 700;
  }

  .vudal>.header.center {
    text-align: center;
  }

  .vudal>.header.main {
    margin-top: 17px;
  }

  .vudal>.content {
    display: block;
    /*width: 100%;*/
    font-size: 1em;
    line-height: 1.4;
    padding: 1.5rem;
    background: #FFF;
  }

  .vudal.alert>.content {
    margin-bottom: 20px;
  }

  .vudal>.actions {
    background: #F9FAFB;
    padding: 1rem;
    border-top: 1px solid rgba(34,36,38,.15);
    text-align: right;
  }

  .vudal>.close {
    cursor: pointer;
    position: absolute;
    top: -2.5rem;
    right: -2.5rem;
    z-index: 1;
    opacity: .8;
    font-size: 1.25em;
    color: #FFF;
    width: 2.25rem;
    height: 2.25rem;
    padding: .625rem 0 0;
  }

  .vudal>.icon:first-child+*, .vudal>:first-child:not(.icon) {
    border-top-left-radius: .28571429rem;
    border-top-right-radius: .28571429rem;
  }

  .vudal>:last-child {
    border-bottom-left-radius: .28571429rem;
    border-bottom-right-radius: .28571429rem;
  }

  .vudal.child-active {
    filter: blur(4px);
    -webkit-filter: blur(4px);
    -moz-filter: blur(4px);
    -o-filter: blur(4px);
    -ms-filter: blur(4px);
    filter:progid:DXImageTransform.Microsoft.Blur(PixelRadius='4');
    position: fixed;
  }

  .vudal .horizontal-scroll {
    overflow-x: scroll;
  }

  @media only screen and (max-width: 767px) {
    .vudal {
      width: 95%;
      margin: 0 0 0 -47.5%;
    }

    .vudal>.close {
      top: .5rem!important;
      right: .5rem!important;
    }
  }

  @media only screen and (max-width: 991px) {
    .vudal>.close {
      top: 1.0535rem;
      right: 1rem;
      color: rgba(0,0,0,.87);
    }
  }

  .vudal-btn {
    display: inline-block;
    font-weight: 400;
    line-height: 1.25;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: 8px 16px;
    font-size: 1em;
    border-radius: .25rem;
    -webkit-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
    color: #292b2c;
    background-color: #fff;
    border-color: #ccc;
  }

  .vudal-btn-primary {
    color: #fff;
    background-color: #0275d8;
    border-color: #0275d8;
  }

  .vudal-btn-success {
    color: #fff;
    background-color: #5cb85c;
    border-color: #5cb85c;
  }

  .vudal-btn-danger {
    color: #fff;
    background-color: #d9534f;
    border-color: #d9534f;
  }

  .vudal-btn-warning {
    color: #fff;
    background-color: #f0ad4e;
    border-color: #f0ad4e;
  }

  .vudal-dimmer, .vudal-fade-in {

    -webkit-animation: fadein .4s; /* Safari, Chrome and Opera > 12.1 */
    -moz-animation: fadein .4s; /* Firefox < 16 */
    -ms-animation: fadein .4s; /* Internet Explorer */
    -o-animation: fadein .4s; /* Opera < 12.1 */
    animation: fadein .4s;
  }

  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Firefox < 16 */
  @-moz-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Safari, Chrome and Opera > 12.1 */
  @-webkit-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Internet Explorer */
  @-ms-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Opera < 12.1 */
  @-o-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes fadeout {
    from { opacity: 1; }
    to   { opacity: 0; }
  }

  .sticky-header {
    position: sticky;
    top: 0px;
  }

  .sticky-actions {
    position: sticky;
    bottom: 0px;
  }
</style>
