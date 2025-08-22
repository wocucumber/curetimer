class Page {
  #id = undefined;
  #jq = undefined;
  constructor(id) {
    this.#id = id;

    $(() => {
      this.#jq = $("page["+this.#id+"]");
    });
  }
  show(anim=true) {
    if (anim) {
      this.#jq.fadeIn(500).addClass("page-shown");
      setTimeout(() => {
        this.#jq.css("display", null);
      }, 600);
    } else {
      this.#jq.addClass("page-shown");
    }
  }
  change(anim=true) {
    if (anim) {
      $(".page-shown").fadeOut(500);

      setTimeout(() => {
        $(".page-shown").removeClass("page-shown");
        this.#jq.fadeIn(500).addClass("page-shown");
        setTimeout(() => {
          this.#jq.css("display", null);
        }, 600);
      }, 500);
    } else {
      $(".page-shown").removeClass("page-shown");
      this.#jq.addClass("page-shown");
    }
  }
  hide(anim=true) {
    if (anim) {
      this.#jq.fadeOut(500);
      setTimeout(() => {
        this.#jq.removeClass("page-shown");
      }, 500);
    } else {
      this.#jq.removeClass("page-shown");
    }
  }
}