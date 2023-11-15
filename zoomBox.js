class zoomBox{
    constructor(zoomContainerName, options = {}){
        // Infos Container
        this.zoomContainer = document.querySelector(zoomContainerName);
        this.zoomContainerInfos = this.zoomContainer.getBoundingClientRect();

        // Infos Image Zoom
        this.imageZoom = this.zoomContainer.querySelector(".imageZoom");
        this.srcImage = this.imageZoom.getAttribute("src");
        this.imageZoomInfos = this.imageZoom.getBoundingClientRect();

        // Create Zoom Box
        this.zoomBox = document.createElement("div");
        this.zoomBox.classList.add("zoomBox");
        this.zoomContainer.prepend(this.zoomBox);

        // Fixed Styles 
        this.zoomContainer.style.position = "relative";
        this.zoomContainer.style.zIndex = "9";

        this.zoomBox.style.cursor = "zoom-in";
        this.zoomBox.style.position = "absolute";
        this.zoomBox.style.backgroundImage = `url("${this.srcImage}")`;
        this.zoomBox.style.backgroundRepeat = "no-repeat";
        this.zoomBox.style.backgroundAttachment = "local";
        this.zoomBox.style.zIndex = "10";

        // Apply Options Styles 
        this.zoomBoxWidth = options.width ?? 120;
        this.zoomBoxHeigth = options.height ?? 120;
        this.zoomBoxSize = options.scale ?? 1.5;
        this.zoomBorder = options.radius ?? "100%";

        // Validation options  
        if (typeof(this.zoomBoxWidth) !== 'number' || this.zoomBoxWidth <= 0) {
            throw new Error('Invalid Value (options: width) => {the value has to be number and > 0}');
        }
        if (typeof(this.zoomBoxHeigth) !== 'number' || this.zoomBoxHeigth <= 0) {
            throw new Error('Invalid Value (options.height) => {the value has to be number and > 0}');
        }
        if (typeof(this.zoomBoxSize) !== 'number' || this.zoomBoxSize <= 0) {
            throw new Error('Invalid Value (options: scale) => {the value has to be number and > 0}');
        }

        // Variable Styles
        this.zoomFactor = parseFloat(this.zoomBoxSize);
        this.imageZoomInfosWidth = parseFloat(this.imageZoomInfos.width);
        this.imageZoomInfosHeigth = parseFloat(this.imageZoomInfos.height);
        this.zoomBoxSizeWidth = this.zoomFactor * this.imageZoomInfosWidth; 
        this.zoomBoxSizeHeigth = this.zoomFactor * this.imageZoomInfosHeigth;

        this.halfZoomBoxWidth = parseFloat(this.zoomBoxWidth) / 2; 
        this.halfZoomBoxHeigth = parseFloat(this.zoomBoxHeigth) / 2; 

        this.maxBackPosX = (this.imageZoomInfosWidth * this.zoomFactor) - this.zoomBoxWidth;
        this.maxBackPosY = (this.imageZoomInfosHeigth * this.zoomFactor)  - this.zoomBoxHeigth;

        // Apply Styles
        this.zoomBox.style.backgroundSize = `${this.zoomBoxSizeWidth}px ${this.zoomBoxSizeHeigth}px`;
        this.zoomBox.style.width = `${this.zoomBoxWidth}px`; 
        this.zoomBox.style.height = `${this.zoomBoxHeigth}px`;
        this.zoomBox.style.borderRadius = `${this.zoomBorder}`;
        this.zoomBox.style.objectFit = 'contain';
        this.zoomBox.style.backgroundSize = `${this.zoomBoxSizeWidth}px, ${this.zoomBoxSizeHeigth}px`;
    
        // First init
        this.initAux = false;
    }

    // zoom Function
    zoomFunction(event){
        // mouse position
        const positionMouseX = (event.clientX + 2) - this.zoomContainerInfos.left;
        const positionMouseY = (event.clientY + 2) - this.zoomContainerInfos.top;
    
        // zoomBox Position
        const zoomBoxPositionX = positionMouseX - this.halfZoomBoxWidth; 
        const zoomBoxPositionY = positionMouseY - this.halfZoomBoxHeigth;

        // Aplly zoomBox Position
        if (positionMouseX > 0 && positionMouseX < this.imageZoomInfosWidth) {
            this.zoomBox.style.left = `${zoomBoxPositionX}px`;  
        }  
        
        if (positionMouseY > 0 && positionMouseY < this.imageZoomInfosHeigth) {
            this.zoomBox.style.top = `${zoomBoxPositionY}px`;
        } 
        
        // Background Image
        let backPosX = (parseFloat(zoomBoxPositionX) * this.zoomFactor) + ((this.zoomBoxWidth  / this.zoomFactor) / 2);
        let backPosY = (parseFloat(zoomBoxPositionY) * this.zoomFactor) + ((this.zoomBoxHeigth / this.zoomFactor) / 2);
        
        backPosX = Math.min(this.maxBackPosX, Math.max(0, backPosX));
        backPosY = Math.min(this.maxBackPosY, Math.max(0, backPosY));
        
        this.zoomBox.style.backgroundPositionX = `-${backPosX}px`;
        this.zoomBox.style.backgroundPositionY = `-${backPosY}px`;
    }

    // Mouse Functions
    mouseOver() {
        this.zoomContainer.addEventListener("mousemove", this.zoomFunction.bind(this));
        this.zoomBox.style.display = "block";
    }
    mouseLeave() {
        this.zoomContainer.removeEventListener("mousemove", this.zoomFunction.bind(this));
        this.zoomBox.style.display = "none"; 
    }

    // Resize screen
    resize() {
        this.zoomContainerInfos = this.zoomContainer.getBoundingClientRect();
        this.imageZoomInfos = this.imageZoom.getBoundingClientRect();
    }

    // Init Events
    init(newOptions = {}){
        this.zoomContainer.addEventListener("mouseover", this.mouseOver.bind(this));
        this.zoomContainer.addEventListener("mouseleave", this.mouseLeave.bind(this)); 

        // Re Init
        if(this.initAux){
            const zoomBoxExist = this.zoomContainer.querySelector(".zoomBox")
            if(!zoomBoxExist){
                this.zoomContainer.prepend(this.zoomBox);
            }
    
            if(Object.keys(newOptions).length > 0){    
                this.zoomBoxWidth = newOptions.width ?? 120;
                this.zoomBoxHeigth = newOptions.height ?? 120;
                this.zoomBoxSize = newOptions.scale ?? 1.5;
                this.zoomBorder = newOptions.radius ?? "100%";
            }
        }

        // Call Resize Method
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('scroll', this.resize.bind(this));

        this.initAux = true;
    }

    // Remove Events (destroy)
    destroy(){
        this.zoomContainer.removeEventListener("mouseover", this.mouseOver.bind(this));
        this.zoomContainer.removeEventListener("mouseleave", this.mouseLeave.bind(this)); 
        window.removeEventListener('resize', this.resize.bind(this));
        window.removeEventListener('scroll', this.resize.bind(this));

        this.zoomBox.remove();
    }

    // Verificar dados da Class 
    console(){
        console.log(this);
    }
}

export default zoomBox;

/*
    Exemplo de utilização

    import zoomBox from './zoomBox.js'; 

    document.addEventListener('DOMContentLoaded', function() {
        const zoomBoxElement = new zoomBox(".zoomContainer", {
            width: 120,
            height: 120,
            scale: 1.5,
            radius: "60px"
        }).init(); 
        
    });
*/