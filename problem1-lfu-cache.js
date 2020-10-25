//https://leetcode.com/problems/lru-cache/
//runtime:
//complexity:
//leetcode?:
//obstacles:
//approach:

// from https://codereview.stackexchange.com/questions/74330/simple-linked-hash-map-in-js-node-browser
/**
 * A linked-list with key-based map. Use case: recent items cache, storing the
 * last X items with linear-time lookup and removal (constant average cost per
 * operation)
 *
 * - Adding an item to head will remove any existing items with that key
 * - Adding to head will remove an item from tail if needed to prevent
 *   exceeding max length
 */

function LinkedHashMap(maxLength) {
  this.map = {};
  this.head = null;
  this.tail = null;
  this.length = 0;
  this.maxLength = maxLength;
}

LinkedHashMap.prototype = {
  get: function(key) {
    var item = this.map[key] || {};
    return item.payload;
  },

  addHead: function(key, payload) {
    this.remove(key);
    if (this.length === this.maxLength) {
      this.removeTail();
    }
    var item = {
      key: key,
      prev: null,
      next: this.head,
      payload: payload
    };
    if (this.head) {
      this.head.prev = item;
    }
    this.head = item;
    if (!this.tail) {
      this.tail = item;
    }
    this.map[key] = item;
    this.length += 1;
  },

  removeTail: function() {
    if (this.tail) {
      this.removeItem(this.tail);
    }
  },

  // remove item by key
  remove: function(key) {
    var item = this.map[key];
    if (!item) return;
    this.removeItem(item);
  },

  // this removes an item from the link chain and updates length/map
  removeItem: function(item) {
    if (this.head === item) {
      this.head = item.next;
    }
    if (this.tail === item) {
      this.tail = item.prev;
    }
    if (item.prev) {
      item.prev.next = item.next;
    }
    if (item.next) {
      item.next.prev = item.prev;
    }
    delete this.map[item.key];
    this.length -= 1;
  }
};

/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
  return Object.assign(
    Object.create(LRUCache.prototype), {
      keyToCount: new Map(),
      countToLRU: new Map(),
      min_count: 0,
      capacity,
    }
  )
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  if(!this.keyToCount.has(key)) return -1

  const count = this.keyToCount.get(key)
  const value = this.countToLRU.get(count).remove(key)

  if (count === this.min_count && this.countToLRU.get(count).size < 1) {
    this.min_count++
  }

  this.keyToCount.set(key, count + 1)
  if(!this.countToLRU.has(count + 1)) {
    this.countToLRU.set(count+1, LinkedHashMap(this.capacity))
  }
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {

};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
