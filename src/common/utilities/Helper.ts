export class Helper {

    public static isDefined(variable) {
        return ((typeof variable !== 'undefined') && variable !== null && variable !== 'null');
    }
}