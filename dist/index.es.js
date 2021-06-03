import { jsx } from 'react/jsx-runtime';
import { createContext, useState, useEffect, useContext, useCallback } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

var Translation = /** @class */ (function () {
    function Translation(currentLanguage) {
        var _this = this;
        var packages = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            packages[_i - 1] = arguments[_i];
        }
        this.getContextByDomains = function (language) {
            var domains = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                domains[_i - 1] = arguments[_i];
            }
            var context = {};
            _this.packages.map(function (pack) {
                if (!domains.includes(pack.domain) || pack.language !== language) {
                    return pack;
                }
                context = __assign(__assign({}, context), pack.context);
                return pack;
            });
            return context;
        };
        this.packages = __spreadArray([], packages);
        this.currentLanguage = currentLanguage;
    }
    return Translation;
}());
var context = createContext(undefined);
var Provider = function (props) {
    var _a = useState(new (Translation.bind.apply(Translation, __spreadArray([void 0, props.currentLanguage], (props.packages || []))))()), translation = _a[0], setTranslation = _a[1];
    useEffect(function () {
        if (!Array.isArray(props.packages))
            return;
        setTranslation(new (Translation.bind.apply(Translation, __spreadArray([void 0, props.currentLanguage], props.packages)))());
    }, [props.packages, props.currentLanguage]);
    return (jsx(context.Provider, __assign({ value: [translation, setTranslation] }, { children: props.children }), void 0));
};
var useTranslation = function (domains) {
    var translationContext = useContext(context);
    if (!Array.isArray(translationContext) || translationContext.length !== 2) {
        throw Error("failed to load translation context.");
    }
    var translation = translationContext[0];
    var _a = useState({}), languageContext = _a[0], setLanguageContext = _a[1];
    useEffect(function () {
        var langCtx = translation.getContextByDomains.apply(translation, __spreadArray([translation.currentLanguage], domains));
        setLanguageContext(langCtx);
    }, [domains, translation]);
    var tranFn = useCallback(function (src) {
        if (src in languageContext) {
            return languageContext[src];
        }
        return src;
    }, [languageContext]);
    return {
        t: tranFn,
    };
};

export default Translation;
export { Provider, useTranslation };
