var random_int = function (min, max) {
        return Math.floor(Math.random()*(max-min+1)) + min;
};

exports.analyze = function(input, chunk_size) {
    var stats = {'\0': {'total': 0, 'options' : {}}};
    var num = input.length;
    var i;
    var word;
    var cnum;
    var next_chunk;
    for (i = 0; i < num; i++) {
        word = input[i];
        if (word.length < chunk_size) {
            continue
        }
        next_chunk = word.substr(0, chunk_size);
        stats['\0'].total++;
        stats['\0'].options[next_chunk] = stats['\0'].options[next_chunk] || 0;
        stats['\0'].options[next_chunk]++;
        cnum = 0;
        while (cnum < word.length) {
            if (cnum - chunk_size >= 0) {
                chunk = word.substring(cnum-chunk_size,cnum);
            }
            else {
                cnum++;
                continue;
            }
            next_chunk = word[cnum]
            stats[chunk] = stats[chunk] || {'total': 0, 'options': {}};
            stats[chunk].options[next_chunk] = stats[chunk].options[next_chunk] || 0;
            stats[chunk].total++;
            stats[chunk].options[next_chunk]++;
  
            cnum++;
        }
  
        chunk = word.substr(-chunk_size);
        stats[chunk] = stats[chunk] || {'total': 0, 'options': {}};
        stats[chunk].options['\0'] = stats[chunk].options['\0'] || 0;
        stats[chunk].total++;
        stats[chunk].options['\0']++;
    }

    return {chunk_size: chunk_size, stats: stats};
}

var choose_chunk = function(stat) {
    var r = random_int(1, stat.total);
    var i;
        //options = stats[c].options;
    for (i in stat.options) {
        r -= stat.options[i];
        if (r <= 0) {
            return i;
        }
    }

};

exports.generate = function(analysis, min_len, max_len) {
    if (min_len > max_len) {
        throw new Error("min_len can't be greater than max_len");
    }

    var chunk_size = analysis.chunk_size;
    var stats = analysis.stats;

    var word = '';
    var new_chunk = '\0';
    var cur_chunk = '\0';
    while (word.length < min_len) {
        word = ''
        cur_chunk = '\0';
        while (word.length < max_len) {
            new_chunk = choose_chunk(stats[cur_chunk]); //random.choice(list(choice_iter(stats[cur_chunk]['options'])))
            if (new_chunk === '\0') {
                break;
            }
            word += new_chunk;
            cur_chunk = word.substr(-chunk_size);
        }
        //we can't stop here if our most recent chunk can not be terminal
        //or we have a dirty word
        if (!('\0' in stats[cur_chunk].options)) {
            word = '';
        }
    }
    return word;
}

var words='cat,dog,spoon,monkey,moon,sun,ocean,glue,beluga,baleen,tuberculosis,zig,bird,sky,cloud,fish,few,raccoon,squid,mammal,cabin,smoke,comfy,couch,chair,wife,husband,sleep,dream,twinkle,sweet,candy,swim,belly,tummy,broom,scare,fwoosh,puppy,kitten,shoe,brain,hammer,hand,wave,swirl,swoosh,goose,swan,button,scythe,fun,bubble,swish,bug,toosh,baby,room,moor,door,ham,pig,bucket,twine,hair,food,yum,rub,scuba,jam,jelly,ghost,phantom,specter,warm,summer,bell,dust,wham,head,vroom,tuba,bazooka,trumpet,puma,skip,burger,mother,father,wheel,axle,wobble,rare,airplane,phone,net,jump,nibble,oboe,dude';

//var an = exports.analyze(words.split(','), 2);
//console.log('%j', an);
//console.log(exports.generate(an, 9, 9));

exports.BASE_ANALYSIS = exports.analyze(words.split(','), 2);