class BaseResponse {
    constructor(success = true, message = "success", data, metadata) {
        this.success = success
        this.message = message
        this.data = data
        this.metadata = metadata
    }

}

module.exports = BaseResponse