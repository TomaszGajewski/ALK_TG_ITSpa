export const calculateComplexity = (password) => {
    var complexity = 0;
    
    var regExps = [ 
      /[a-z]/,
      /[A-Z]/,
      /[0-9]/,
      /.{8}/,
      /.{16}/,
      /[!-//:-@[-`{-ÿ]/
    ];
    
    regExps.forEach(function (regexp) {
      if (regexp.test(password)) {
        complexity++;
      }
    });
    
    return {
      value: complexity,
      max: regExps.length
    };
  };